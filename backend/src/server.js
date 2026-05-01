import app from './app.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

let server;

async function startServer() {
  await connectDB();

  server = app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully.`);

  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    return;
  }

  await disconnectDB();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.message}`);

  if (server) {
    server.close(() => process.exit(1));
    return;
  }

  process.exit(1);
});

startServer();
