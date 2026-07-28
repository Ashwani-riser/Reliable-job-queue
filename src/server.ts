import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";
import logger from "./loggers/logger";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
        },
        "Server started successfully"
      );
    });
  } catch (error) {
    logger.fatal({ error }, "Application failed to start");
    process.exit(1);
  }
};

startServer();