import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import { createClient } from 'redis';
import * as amqp from 'amqplib';

// Controllers
import { AnalyticsController } from './presentation/controllers/AnalyticsController';
import { SurveyController } from './presentation/controllers/SurveyController';

// Use Cases
import { TrackAnalyticsEventUseCase } from './application/use-cases/TrackAnalyticsEventUseCase';
import { GenerateDashboardMetricsUseCase } from './application/use-cases/GenerateDashboardMetricsUseCase';
import { GenerateReportUseCase } from './application/use-cases/GenerateReportUseCase';
import { ManageSurveyUseCase } from './application/use-cases/ManageSurveyUseCase';

// Repositories (will be implemented)
import { MySQLAnalyticsRepository } from './infrastructure/database/MySQLAnalyticsRepository';
import { MySQLSurveyRepository } from './infrastructure/database/MySQLSurveyRepository';
import { MockAnalyticsRepository } from './infrastructure/database/MockAnalyticsRepository';
import { RealDataAnalyticsRepository } from './infrastructure/database/RealDataAnalyticsRepository';

// Routes
import { createAnalyticsRoutes } from './presentation/routes/analytics.routes';
import { createSurveyRoutes } from './presentation/routes/survey.routes';

// Middleware
import { errorHandler } from './presentation/middleware/errorHandler';
import { rateLimitMiddleware } from './presentation/middleware/rateLimitMiddleware';

export class App {
  private app: express.Application;
  private server: any;
  private io!: Server;
  private rabbitMQConnection?: amqp.Connection;
  private rabbitMQChannel?: amqp.Channel;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupDatabase();
    this.setupRedis();
    this.setupSocketIO();
    // Setup routes and RabbitMQ async (don't block startup)
    this.setupRoutes().catch(err => 
      console.error('❌ Route setup failed:', err)
    );
    this.setupRabbitMQ().catch(err => 
      console.log('⚠️  RabbitMQ setup failed, continuing without message queue:', err.message)
    );
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    this.app.use(rateLimitMiddleware);

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupDatabase(): void {
    try {
      // MySQL connection pool
      const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        database: process.env.DB_NAME || 'eventix_checkin',
        user: process.env.DB_USER || 'eventix',
        password: process.env.DB_PASSWORD || 'password',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Test database connection
      pool.getConnection()
        .then((connection) => {
          console.log('✅ Connected to MySQL database');
          connection.release();
        })
        .catch((err) => {
          console.error('❌ Error connecting to MySQL:', err);
          console.log('⚠️  Service will continue without database - using mock data');
        });

      // Make database connections available globally
      (global as any).dbPool = pool;
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      console.log('⚠️  Service will continue without database - using mock data');
    }
  }

  private setupRedis(): void {
    try {
      // Redis client
      const redisClient = createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
      });

      // Test Redis connection
      redisClient.on('connect', () => {
        console.log('✅ Connected to Redis');
      });

      redisClient.on('error', (err: any) => {
        console.error('❌ Redis connection error:', err);
        console.log('⚠️  Service will continue without Redis - caching disabled');
      });

      // Make Redis client available globally
      (global as any).redisClient = redisClient;
    } catch (error) {
      console.error('❌ Redis setup failed:', error);
      console.log('⚠️  Service will continue without Redis - caching disabled');
    }
  }

  private async setupRabbitMQ(): Promise<void> {
    try {
      // Connect to RabbitMQ with retry logic
      const connection = await amqp.connect({
        hostname: process.env.RABBITMQ_HOST || 'localhost',
        port: parseInt(process.env.RABBITMQ_PORT || '5672'),
        username: process.env.RABBITMQ_USER || 'eventix',
        password: process.env.RABBITMQ_PASS || 'password',
      });

      this.rabbitMQConnection = connection;
      this.rabbitMQChannel = await connection.createChannel();

      if (this.rabbitMQChannel) {
        // Declare queues for inter-service communication
        await this.rabbitMQChannel.assertQueue('analytics.events', { durable: true });
        await this.rabbitMQChannel.assertQueue('analytics.reports', { durable: true });
        await this.rabbitMQChannel.assertQueue('analytics.surveys', { durable: true });

        // Declare exchanges
        await this.rabbitMQChannel.assertExchange('eventix.events', 'topic', { durable: true });

        // Bind queues to exchanges
        await this.rabbitMQChannel.bindQueue('analytics.events', 'eventix.events', 'event.*');
        await this.rabbitMQChannel.bindQueue('analytics.reports', 'eventix.events', 'report.*');
        await this.rabbitMQChannel.bindQueue('analytics.surveys', 'eventix.events', 'survey.*');
      }

      console.log('✅ Connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Error connecting to RabbitMQ:', error);
      console.log('⚠️  Service will continue without RabbitMQ - message queue features disabled');
      // Don't throw error - let service continue without RabbitMQ
    }
  }

  private setupSocketIO(): void {
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true
      }
    });

    // Socket.IO connection handling
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join event room for real-time updates
      socket.on('join-event', (eventId: string) => {
        socket.join(`event-${eventId}`);
        console.log(`Client ${socket.id} joined event ${eventId}`);
      });

      // Handle analytics events
      socket.on('analytics-event', (data) => {
        // Broadcast analytics event to all clients in the event room
        this.io.to(`event-${data.eventId}`).emit('analytics-updated', data);
      });

      // Handle dashboard updates
      socket.on('dashboard-update', (data) => {
        this.io.to(`event-${data.eventId}`).emit('dashboard-updated', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private async setupRoutes(): Promise<void> {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Eventix Analytics Service',
        version: '1.0.0',
        database: 'Connected',
        redis: 'Connected',
        rabbitmq: this.rabbitMQConnection ? 'Connected' : 'Disconnected'
      });
    });

    // Dashboard endpoint
    this.app.get('/dashboard', async (req, res) => {
      try {
        // Get repository instance (will be available after routes setup)
        let analyticsRepository;
        
        // Initialize the same way as in routes setup
        const dbPool = (global as any).dbPool;
        try {
          if (dbPool) {
            await dbPool.getConnection().then((conn: any) => conn.release());
            analyticsRepository = new RealDataAnalyticsRepository(dbPool);
          } else {
            throw new Error('No database pool available');
          }
        } catch (error) {
          analyticsRepository = new MockAnalyticsRepository();
        }

        // Get recent analytics events
        const recentEvents = await analyticsRepository.getAnalyticsEvents({
          limit: 10,
          offset: 0
        });

        // Get dashboard metrics  
        const metrics = await analyticsRepository.getDashboardMetrics({
          limit: 5,
          period: 'daily' as any
        });

        // Get recent reports
        const reports = await analyticsRepository.getReports({
          limit: 5
        });

        // Create HTML dashboard
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eventix Analytics Dashboard</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header { 
            background: #2c3e50; 
            color: white; 
            padding: 20px; 
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
        }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 20px 0; 
        }
        .stat-card { 
            background: #ecf0f1; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center;
            border-left: 4px solid #3498db;
        }
        .stat-number { 
            font-size: 2em; 
            font-weight: bold; 
            color: #2c3e50; 
        }
        .section { 
            margin: 30px 0; 
        }
        .section h3 { 
            color: #2c3e50; 
            border-bottom: 2px solid #3498db; 
            padding-bottom: 10px; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 10px 0; 
        }
        th, td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #ddd; 
        }
        th { 
            background: #34495e; 
            color: white; 
        }
        tr:hover { 
            background: #f5f5f5; 
        }
        .badge { 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 0.8em; 
            font-weight: bold; 
        }
        .badge-success { background: #2ecc71; color: white; }
        .badge-info { background: #3498db; color: white; }
        .badge-warning { background: #f39c12; color: white; }
        .refresh-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 0;
        }
        .refresh-btn:hover { background: #2980b9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Eventix Analytics Dashboard</h1>
            <p>Real-time analytics and metrics • ${new Date().toLocaleString()}</p>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${recentEvents.length}</div>
                <div>Recent Events</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${metrics.length}</div>
                <div>Active Metrics</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${reports.length}</div>
                <div>Generated Reports</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${metrics.reduce((sum, m) => sum + m.metricValue, 0)}</div>
                <div>Total Value</div>
            </div>
        </div>

        <div class="section">
            <h3>📈 Recent Analytics Events</h3>
            <table>
                <thead>
                    <tr>
                        <th>Event ID</th>
                        <th>Type</th>
                        <th>User ID</th>
                        <th>Session ID</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentEvents.map(event => `
                        <tr>
                            <td>${event.eventId}</td>
                            <td><span class="badge badge-info">${event.eventType}</span></td>
                            <td>${event.userId || 'N/A'}</td>
                            <td>${event.sessionId || 'N/A'}</td>
                            <td>${event.timestamp.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h3>📊 Dashboard Metrics</h3>
            <table>
                <thead>
                    <tr>
                        <th>Metric Name</th>
                        <th>Value</th>
                        <th>Unit</th>
                        <th>Category</th>
                        <th>Period</th>
                    </tr>
                </thead>
                <tbody>
                    ${metrics.map(metric => `
                        <tr>
                            <td>${metric.metricName}</td>
                            <td><strong>${metric.metricValue}</strong></td>
                            <td>${metric.metricUnit || 'count'}</td>
                            <td><span class="badge badge-success">${metric.category || 'general'}</span></td>
                            <td>${metric.period}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h3>📄 Recent Reports</h3>
            <table>
                <thead>
                    <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Generated By</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    ${reports.map(report => `
                        <tr>
                            <td>${report.reportName}</td>
                            <td><span class="badge badge-info">${report.reportType}</span></td>
                            <td><span class="badge badge-success">${report.status}</span></td>
                            <td>${report.generatedBy}</td>
                            <td>${report.createdAt.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h3>🔗 API Endpoints</h3>
            <ul>
                <li><strong>Health Check:</strong> <a href="/health">/health</a></li>
                <li><strong>Analytics Events:</strong> POST /api/v1/analytics/events</li>
                <li><strong>Dashboard Metrics:</strong> GET /api/v1/analytics/metrics</li>
                <li><strong>Generate Reports:</strong> POST /api/v1/analytics/reports</li>
                <li><strong>Surveys:</strong> /api/v1/surveys/*</li>
                <li><strong>Checkin Data (Real):</strong> <a href="/checkin-data">/checkin-data</a></li>
            </ul>
        </div>
    </div>
</body>
</html>`;

        res.send(html);
      } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to load dashboard',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Checkin Data endpoint - for debugging real data integration
    this.app.get('/checkin-data', async (req, res) => {
      try {
        const eventId = req.query.eventId as string || 'event-001';
        const dbPool = (global as any).dbPool;
        
        if (!dbPool) {
          return res.json({
            success: false,
            error: 'Database not available',
            message: 'Cannot fetch real checkin data without database connection'
          });
        }

        const checkinRepo = new (await import('./infrastructure/external/CheckinServiceRepository')).CheckinServiceRepository(
          process.env.CHECKIN_SERVICE_URL || 'http://localhost:3001',
          dbPool
        );

        const eventSummary = await checkinRepo.getEventSummary(eventId);
        
        res.json({
          success: true,
          data: eventSummary,
          source: 'real-checkin-service',
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error fetching checkin data:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch checkin data',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // API routes
    const apiVersion = process.env.API_VERSION || 'v1';
    const apiRouter = express.Router();

    // Initialize repositories - use real data if possible, then fallback
    const dbPool = (global as any).dbPool;
    let analyticsRepository;
    let surveyRepository;
    
    try {
      // Try to use Real Data Repository with Checkin Service integration
      if (dbPool) {
        await dbPool.getConnection().then((conn: any) => conn.release());
        analyticsRepository = new RealDataAnalyticsRepository(dbPool);
        console.log('✅ Using Real Data Analytics Repository (with Checkin Service integration)');
      } else {
        throw new Error('No database pool available');
      }
    } catch (error) {
      console.log('⚠️  Database not available, using Mock Analytics Repository');
      analyticsRepository = new MockAnalyticsRepository();
    }
    
    try {
      surveyRepository = new MySQLSurveyRepository(dbPool);
    } catch (error) {
      console.log('⚠️  Using mock survey repository (not implemented yet)');
      surveyRepository = new MySQLSurveyRepository(dbPool); // Will be handled later
    }

    // Initialize use cases
    const trackAnalyticsEventUseCase = new TrackAnalyticsEventUseCase(analyticsRepository);
    const generateDashboardMetricsUseCase = new GenerateDashboardMetricsUseCase(analyticsRepository);
    const generateReportUseCase = new GenerateReportUseCase(analyticsRepository);
    const manageSurveyUseCase = new ManageSurveyUseCase(surveyRepository);

    // Initialize controllers
    const analyticsController = new AnalyticsController(
      trackAnalyticsEventUseCase,
      generateDashboardMetricsUseCase,
      generateReportUseCase
    );
    const surveyController = new SurveyController(manageSurveyUseCase);

    // Setup routes with new structure
    apiRouter.use('/analytics', createAnalyticsRoutes(analyticsController));
    apiRouter.use('/surveys', createSurveyRoutes(surveyController));
    
    // Add routes for checkin integration
    apiRouter.use('/checkin', (req, res) => {
      res.status(200).json({
        message: "Checkin endpoints should be accessed via Checkin Service at http://localhost:3001/checkin",
        analytics_available: true
      });
    });

    // Mount API routes directly (no /api/v1 prefix)
    this.app.use('/', apiRouter);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found'
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(port: number = parseInt(process.env.PORT || '3002')): void {
    this.server.listen(port, () => {
      console.log(`🚀 Eventix Analytics Service running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`🔌 Socket.IO server ready`);
      console.log(`📈 Analytics endpoints: http://localhost:${port}/analytics`);
      console.log(`📝 Survey endpoints: http://localhost:${port}/surveys`);
    });
  }

  public getIO(): Server {
    return this.io;
  }

  public getApp(): express.Application {
    return this.app;
  }

  public getRabbitMQChannel(): amqp.Channel | undefined {
    return this.rabbitMQChannel;
  }

  public async close(): Promise<void> {
    if (this.rabbitMQChannel) {
      await this.rabbitMQChannel.close();
    }
    if (this.rabbitMQConnection) {
      await this.rabbitMQConnection.close();
    }
    if (this.server) {
      this.server.close();
    }
  }
}
