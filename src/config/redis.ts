import Redis from "ioredis";
import { env } from "./env";
import logger from "../loggers/logger";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("error", (error) => {
  logger.error({ error }, "Redis connection error");
});

export default redis;