import express from 'express';
import { Server } from 'socket.io';
import * as amqp from 'amqplib';
export declare class App {
    private app;
    private server;
    private io;
    private rabbitMQConnection?;
    private rabbitMQChannel?;
    constructor();
    private setupMiddleware;
    private setupDatabase;
    private setupRedis;
    private setupRabbitMQ;
    private setupSocketIO;
    private setupRoutes;
    private setupErrorHandling;
    start(port?: number): void;
    getIO(): Server;
    getApp(): express.Application;
    getRabbitMQChannel(): amqp.Channel | undefined;
    close(): Promise<void>;
}
//# sourceMappingURL=app.d.ts.map