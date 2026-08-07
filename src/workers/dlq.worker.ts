import { Worker } from "bullmq";
import redis from "../config/redis";
import logger from "../loggers/logger";

export const dlqWorker = new Worker(
  "dead-letter-queue",
  async (job) => {
    logger.warn(
      {
        jobId: job.id,
        data: job.data,
      },
      "Job moved to Dead Letter Queue"
    );

    // Future Work:
    // - Notify Admin
    // - Send Slack Alert
    // - Store Analytics
  },
  {
    connection: redis,
  }
);

dlqWorker.on("ready", () => {
  logger.info("DLQ Worker is ready");
});

dlqWorker.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
    },
    "DLQ job processed"
  );
});

dlqWorker.on("failed", (job, err) => {
  logger.error(
    {
      jobId: job?.id,
      error: err.message,
    },
    "DLQ worker failed"
  );
});