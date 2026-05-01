import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;
let server;

async function startServer() {
  await connectDB();

  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
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
