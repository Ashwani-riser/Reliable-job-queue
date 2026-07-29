// src/workers/job.worker.ts

import { Worker, Job } from "bullmq";
import redis from "../config/redis";
import logger from "../loggers/logger";

interface EmailJobData {
  name: string;
  email: string;
}

export const jobWorker = new Worker<EmailJobData>(
  "job-queue",
  async (job: Job<EmailJobData>) => {
    logger.info(
      {
        jobId: job.id,
        jobName: job.name,
        data: job.data,
      },
      "Job processing started"
    );

    try {
      // Simulate some work (Email Sending)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      logger.info(
        {
          jobId: job.id,
          email: job.data.email,
        },
        "Email sent successfully"
      );

      return {
        success: true,
        message: "Job completed successfully",
      };
    } catch (error) {
      logger.error(
        {
          jobId: job.id,
          error,
        },
        "Job processing failed"
      );

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

// --------------------
// Worker Events
// --------------------

jobWorker.on("ready", () => {
  logger.info("Worker is ready");
});

jobWorker.on("active", (job) => {
  logger.info(
    {
      jobId: job.id,
    },
    "Worker started processing job"
  );
});

jobWorker.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
    },
    "Worker completed job"
  );
});

jobWorker.on("failed", (job, err) => {
  logger.error(
    {
      jobId: job?.id,
      error: err.message,
    },
    "Worker failed job"
  );
});

jobWorker.on("error", (err) => {
  logger.error(
    {
      error: err.message,
    },
    "Worker error"
  );
});

jobWorker.on("closing", () => {
  logger.info("Worker is shutting down");
});

jobWorker.on("closed", () => {
  logger.info("Worker closed");
});