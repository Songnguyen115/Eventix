import dotenv from 'dotenv';
import { App } from './app';

// Load environment variables
dotenv.config();

// Create and start the application
const app = new App();
const port = parseInt(process.env.PORT || '3002');

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await app.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await app.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
try {
  app.start(port);
} catch (error) {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}
