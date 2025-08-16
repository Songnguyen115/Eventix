import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import { createClient } from 'redis';

// Controllers
import { CheckInController } from './presentation/controllers/CheckInController';
import { SponsorBoothController } from './presentation/controllers/SponsorBoothController';

// Use Cases
import { CheckInAttendeeUseCase } from './application/use-cases/CheckInAttendeeUseCase';
import { GetAttendanceReportUseCase } from './application/use-cases/GetAttendanceReportUseCase';
import { ValidateQrCodeUseCase } from './application/use-cases/ValidateQrCodeUseCase';
import { ManageSponsorBoothUseCase } from './application/use-cases/ManageSponsorBoothUseCase';

// Repositories
import { MySQLAttendeeRepository } from './infrastructure/database/MySQLAttendeeRepository';

// Routes
import { createCheckInRoutes } from './presentation/routes/checkin.routes';
import { createSponsorBoothRoutes } from './presentation/routes/sponsor-booth.routes';

// Middleware
import { errorHandler } from './presentation/middleware/errorHandler';

export class App {
  private app: express.Application;
  private server: any;
  private io!: Server;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupDatabase();
    this.setupSocketIO();
    this.setupRoutes();
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

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupDatabase(): void {
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

    // Redis client
    const redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
    });

    // Test database connection
    pool.getConnection()
      .then((connection) => {
        console.log('✅ Connected to MySQL database');
        connection.release();
      })
      .catch((err) => {
        console.error('❌ Error connecting to MySQL:', err);
      });

    // Test Redis connection
    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    redisClient.on('error', (err: any) => {
      console.error('Redis connection error:', err);
    });

    // Make database connections available globally
    (global as any).dbPool = pool;
    (global as any).redisClient = redisClient;
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

      // Handle check-in events
      socket.on('check-in', (data) => {
        // Broadcast check-in to all clients in the event room
        this.io.to(`event-${data.eventId}`).emit('attendee-checked-in', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Eventix Check-in Service',
        version: '1.0.0'
      });
    });

    // API routes
    const apiVersion = process.env.API_VERSION || 'v1';
    const apiRouter = express.Router();

    // Initialize repositories
    const attendeeRepository = new MySQLAttendeeRepository((global as any).dbPool);

    // Initialize use cases
    const checkInAttendeeUseCase = new CheckInAttendeeUseCase(attendeeRepository);
    const getAttendanceReportUseCase = new GetAttendanceReportUseCase(attendeeRepository);
    const validateQrCodeUseCase = new ValidateQrCodeUseCase(attendeeRepository);
    const manageSponsorBoothUseCase = new ManageSponsorBoothUseCase(attendeeRepository as any);

    // Initialize controllers
    const checkInController = new CheckInController(
      checkInAttendeeUseCase,
      getAttendanceReportUseCase,
      validateQrCodeUseCase
    );
    const sponsorBoothController = new SponsorBoothController(manageSponsorBoothUseCase);

    // Setup routes
    apiRouter.use('/checkin', createCheckInRoutes(checkInController));
    apiRouter.use('/sponsor-booth', createSponsorBoothRoutes(sponsorBoothController));

    // Mount API routes
    this.app.use(`/api/${apiVersion}`, apiRouter);

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

  public start(port: number = 3001): void {
    this.server.listen(port, () => {
      console.log(`🚀 Eventix Check-in Service running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`🔌 Socket.IO server ready`);
    });
  }

  public getIO(): Server {
    return this.io;
  }

  public getApp(): express.Application {
    return this.app;
  }
}
