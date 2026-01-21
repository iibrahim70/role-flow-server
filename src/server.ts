import mongoose from 'mongoose';
import colors from 'colors';
import { Server } from 'http';
import { config } from './config';
import { appLogger } from './logger';
import app from './app';

let server: Server;

(async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.database.url}/${config.database.name}`,
    );

    appLogger.info(
      colors.green.bold(
        `✅ Database Connected! Host: ${connectionInstance?.connection?.host}`,
      ),
    );

    server = app.listen(Number(config.server.port), () => {
      appLogger.info(
        colors.green.bold(
          `🚀 Server running on localhost :${config.server.port}`,
        ),
      );
    });
  } catch (error) {
    appLogger.error(colors.red.bold(`❌ MongoDB connection error: ${error}`));
    process.exit(1);
  }
})();

process.on('unhandledRejection', (error) => {
  appLogger.error(
    colors.red.bold(`⚠️ Unhandled rejection, shutting down... ${error}`),
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  appLogger.error(
    colors.red.bold(`❌ Uncaught exception: ${error}, shutting down...`),
  );
  process.exit(1);
});
