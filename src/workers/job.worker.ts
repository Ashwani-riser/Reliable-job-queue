// src/workers/job.worker.ts

import { Worker, Job } from "bullmq";
import redis from "../config/redis";
import logger from "../loggers/logger";
import JobModel, { JobStatus } from "../models/job.model";

interface EmailJobData {
  name: string;
  email: string;
}

export const jobWorker = new Worker<EmailJobData>(
  "job-queue",
  async (job: Job<EmailJobData>) => {
    try {
      // Update status -> PROCESSING
      await JobModel.findOneAndUpdate(
        { queueJobId: job.id },
        {
          status: JobStatus.PROCESSING,
        }
      );

      logger.info(
        {
          jobId: job.id,
          jobName: job.name,
          data: job.data,
        },
        "Job processing started"
      );

      // Simulate Email Sending
      await new Promise((resolve) => setTimeout(resolve, 3000));

      logger.info(
        {
          jobId: job.id,
          email: job.data.email,
        },
        "Email sent successfully"
      );

      // Update status -> COMPLETED
      await JobModel.findOneAndUpdate(
        { queueJobId: job.id },
        {
          status: JobStatus.COMPLETED,
        }
      );

      return {
        success: true,
        message: "Job completed successfully",
      };
    } catch (error) {
      // Update status -> FAILED
      await JobModel.findOneAndUpdate(
        { queueJobId: job.id },
        {
          status: JobStatus.FAILED,
          error:
            error instanceof Error ? error.message : "Unknown Error",
        }
      );

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