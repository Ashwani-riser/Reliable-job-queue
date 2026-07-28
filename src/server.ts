import app from "./app";
import connectDB from "./config/db";
import redis from "./config/redis";
import { env } from "./config/env";
import logger from "./loggers/logger";
import gracefulShutdown from "./utils/shutdown";

const startServer = async () => {
  try {
    await connectDB();

    // Verify Redis connection
    await redis.ping();

    logger.info("Redis connection verified");

    const server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
        },
        "Server started successfully"
      );
    });

    // Handle Ctrl + C
    process.on("SIGINT", () =>
      gracefulShutdown({
        server,
        redis,
      })
    );

    // Handle production termination
    process.on("SIGTERM", () =>
      gracefulShutdown({
        server,
        redis,
      })
    );
  } catch (error) {
    logger.fatal({ error }, "Application failed to start");
    process.exit(1);
  }
};

startServer();