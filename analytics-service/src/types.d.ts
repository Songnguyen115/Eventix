// Type declarations to resolve TypeScript compilation issues
declare module 'amqplib' {
  export interface Connection {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }

  export interface Channel {
    assertQueue(name: string, options?: any): Promise<any>;
    assertExchange(name: string, type: string, options?: any): Promise<any>;
    bindQueue(queue: string, exchange: string, routingKey: string): Promise<any>;
    close(): Promise<void>;
  }

  export function connect(options: any): Promise<Connection>;
}

declare module 'mysql2/promise' {
  export interface Pool {
    execute<T>(sql: string, values?: any[]): Promise<[T[], any]>;
    getConnection(): Promise<Connection>;
  }

  export interface Connection {
    release(): void;
  }

  export interface RowDataPacket {
    [key: string]: any;
  }

  export interface ResultSetHeader {
    affectedRows: number;
    insertId: number;
  }

  export function createPool(options: any): Pool;
}

declare module 'redis' {
  export interface RedisClientType {
    connect(): Promise<void>;
    on(event: string, listener: Function): void;
  }

  export function createClient(options: any): RedisClientType;
}

declare module 'socket.io' {
  import { Server as HTTPServer } from 'http';
  
  export class Server {
    constructor(server: HTTPServer, options?: any);
    on(event: string, listener: Function): void;
    to(room: string): any;
    emit(event: string, data: any): void;
  }
}

// Global type declarations
declare global {
  var dbPool: any;
  var redisClient: any;
}

// Fix for database result types
declare module 'mysql2/promise' {
  export interface RowDataPacket {
    [key: string]: any;
  }
  
  export interface ResultSetHeader {
    affectedRows: number;
    insertId: number;
  }
}
