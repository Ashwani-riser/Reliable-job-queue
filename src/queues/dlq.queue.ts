import { Queue } from "bullmq";
import redis from "../config/redis";

export const dlqQueue = new Queue("dead-letter-queue", {
  connection: redis,
});