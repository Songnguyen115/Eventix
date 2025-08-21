"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const promise_1 = __importDefault(require("mysql2/promise"));
const redis_1 = require("redis");
const amqp = __importStar(require("amqplib"));
const AnalyticsController_1 = require("./presentation/controllers/AnalyticsController");
const SurveyController_1 = require("./presentation/controllers/SurveyController");
const TrackAnalyticsEventUseCase_1 = require("./application/use-cases/TrackAnalyticsEventUseCase");
const GenerateDashboardMetricsUseCase_1 = require("./application/use-cases/GenerateDashboardMetricsUseCase");
const GenerateReportUseCase_1 = require("./application/use-cases/GenerateReportUseCase");
const ManageSurveyUseCase_1 = require("./application/use-cases/ManageSurveyUseCase");
const MySQLAnalyticsRepository_1 = require("./infrastructure/database/MySQLAnalyticsRepository");
const MySQLSurveyRepository_1 = require("./infrastructure/database/MySQLSurveyRepository");
const analytics_routes_1 = require("./presentation/routes/analytics.routes");
const survey_routes_1 = require("./presentation/routes/survey.routes");
const errorHandler_1 = require("./presentation/middleware/errorHandler");
const rateLimitMiddleware_1 = require("./presentation/middleware/rateLimitMiddleware");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupDatabase();
        this.setupRedis();
        this.setupRabbitMQ();
        this.setupSocketIO();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true
        }));
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(rateLimitMiddleware_1.rateLimitMiddleware);
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }
    setupDatabase() {
        const pool = promise_1.default.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            database: process.env.DB_NAME || 'eventix_analytics',
            user: process.env.DB_USER || 'eventix',
            password: process.env.DB_PASSWORD || 'password',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        pool.getConnection()
            .then((connection) => {
            console.log('✅ Connected to MySQL database');
            connection.release();
        })
            .catch((err) => {
            console.error('❌ Error connecting to MySQL:', err);
        });
        global.dbPool = pool;
    }
    setupRedis() {
        const redisClient = (0, redis_1.createClient)({
            url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
        });
        redisClient.on('connect', () => {
            console.log('✅ Connected to Redis');
        });
        redisClient.on('error', (err) => {
            console.error('❌ Redis connection error:', err);
        });
        global.redisClient = redisClient;
    }
    async setupRabbitMQ() {
        try {
            const connection = await amqp.connect({
                hostname: process.env.RABBITMQ_HOST || 'localhost',
                port: parseInt(process.env.RABBITMQ_PORT || '5672'),
                username: process.env.RABBITMQ_USER || 'eventix',
                password: process.env.RABBITMQ_PASS || 'password',
            });
            this.rabbitMQConnection = connection;
            this.rabbitMQChannel = await connection.createChannel();
            if (this.rabbitMQChannel) {
                await this.rabbitMQChannel.assertQueue('analytics.events', { durable: true });
                await this.rabbitMQChannel.assertQueue('analytics.reports', { durable: true });
                await this.rabbitMQChannel.assertQueue('analytics.surveys', { durable: true });
                await this.rabbitMQChannel.assertExchange('eventix.events', 'topic', { durable: true });
                await this.rabbitMQChannel.bindQueue('analytics.events', 'eventix.events', 'event.*');
                await this.rabbitMQChannel.bindQueue('analytics.reports', 'eventix.events', 'report.*');
                await this.rabbitMQChannel.bindQueue('analytics.surveys', 'eventix.events', 'survey.*');
            }
            console.log('✅ Connected to RabbitMQ');
        }
        catch (error) {
            console.error('❌ Error connecting to RabbitMQ:', error);
        }
    }
    setupSocketIO() {
        this.server = (0, http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
                credentials: true
            }
        });
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('join-event', (eventId) => {
                socket.join(`event-${eventId}`);
                console.log(`Client ${socket.id} joined event ${eventId}`);
            });
            socket.on('analytics-event', (data) => {
                this.io.to(`event-${data.eventId}`).emit('analytics-updated', data);
            });
            socket.on('dashboard-update', (data) => {
                this.io.to(`event-${data.eventId}`).emit('dashboard-updated', data);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }
    setupRoutes() {
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
        const apiVersion = process.env.API_VERSION || 'v1';
        const apiRouter = express_1.default.Router();
        const analyticsRepository = new MySQLAnalyticsRepository_1.MySQLAnalyticsRepository(global.dbPool);
        const surveyRepository = new MySQLSurveyRepository_1.MySQLSurveyRepository(global.dbPool);
        const trackAnalyticsEventUseCase = new TrackAnalyticsEventUseCase_1.TrackAnalyticsEventUseCase(analyticsRepository);
        const generateDashboardMetricsUseCase = new GenerateDashboardMetricsUseCase_1.GenerateDashboardMetricsUseCase(analyticsRepository);
        const generateReportUseCase = new GenerateReportUseCase_1.GenerateReportUseCase(analyticsRepository);
        const manageSurveyUseCase = new ManageSurveyUseCase_1.ManageSurveyUseCase(surveyRepository);
        const analyticsController = new AnalyticsController_1.AnalyticsController(trackAnalyticsEventUseCase, generateDashboardMetricsUseCase, generateReportUseCase);
        const surveyController = new SurveyController_1.SurveyController(manageSurveyUseCase);
        apiRouter.use('/analytics', (0, analytics_routes_1.createAnalyticsRoutes)(analyticsController));
        apiRouter.use('/surveys', (0, survey_routes_1.createSurveyRoutes)(surveyController));
        this.app.use(`/api/${apiVersion}`, apiRouter);
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found'
            });
        });
    }
    setupErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    start(port = 3003) {
        this.server.listen(port, () => {
            console.log(`🚀 Eventix Analytics Service running on port ${port}`);
            console.log(`📊 Health check: http://localhost:${port}/health`);
            console.log(`🔌 Socket.IO server ready`);
            console.log(`📈 Analytics endpoints: http://localhost:${port}/api/v1/analytics`);
            console.log(`📝 Survey endpoints: http://localhost:${port}/api/v1/surveys`);
        });
    }
    getIO() {
        return this.io;
    }
    getApp() {
        return this.app;
    }
    getRabbitMQChannel() {
        return this.rabbitMQChannel;
    }
    async close() {
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
exports.App = App;
