import redis from "./config/redis";
import connectDB from "./config/db";
import logger from "./loggers/logger";

async function startWorker() {
  try {
    await connectDB();
    await redis.ping();

    logger.info("Redis connection verified");

    // Register Workers
    await import("./workers/job.worker");
    await import("./workers/dlq.worker");

    logger.info("Worker started successfully");
  } catch (error) {
    logger.fatal({ error }, "Worker failed to start");
    process.exit(1);
  }
}

startWorker();