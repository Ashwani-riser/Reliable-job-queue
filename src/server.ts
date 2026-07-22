import app from "./app";
import logger from "./loggers/logger";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      environment: env.NODE_ENV,
    },
    "Server started successfully"
  );
});