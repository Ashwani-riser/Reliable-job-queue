import mongoose from "mongoose";
import Redis from "ioredis";
import { Server } from "http";
import logger from "../loggers/logger";

interface ShutdownOptions {
  server: Server;
  redis: Redis;
}

const gracefulShutdown = async ({
  server,
  redis,
}: ShutdownOptions): Promise<void> => {
  logger.info("Graceful shutdown initiated");

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      await mongoose.connection.close();

      logger.info("MongoDB connection closed");

      await redis.quit();

      logger.info("Redis connection closed");

      process.exit(0);
    } catch (error) {
      logger.error({ error }, "Error during shutdown");

      process.exit(1);
    }
  });
};

export default gracefulShutdown;