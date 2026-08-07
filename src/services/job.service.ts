import mongoose from "mongoose";
import ApiError from "../errors/ApiError";
import Job, { JobStatus } from "../models/job.model";
import { jobQueue } from "../queues/job.queue";
import { dlqQueue } from "../queues/dlq.queue";

export interface CreateJobData {
  name: string;
  email: string;
}

class JobService {
  // Create Job
  async createJob(data: CreateJobData) {
    const job = await Job.create({
      name: data.name,
      email: data.email,
    });

  const queueJob = await jobQueue.add("send-email", {
  name: data.name,
  email: data.email,
});

    job.queueJobId = String(queueJob.id);
    await job.save();

    return job;
  }

  // Get All Jobs (with optional status filter)
  async getAllJobs(status?: JobStatus) {
    const filter: { status?: JobStatus } = {};

    if (status) {
      filter.status = status;
    }

    return await Job.find(filter)
      .sort({ createdAt: -1 })
      .lean();
  }

  // Get Job By Id
  async getJobById(jobId: string) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new ApiError(400, "Invalid Job ID");
    }

    const job = await Job.findById(jobId).lean();

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    return job;
  }

  // Retry Failed Job
  async retryJob(jobId: string) {
    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new ApiError(400, "Invalid Job ID");
    }

    // Find Job
    const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    // Only FAILED jobs can be retried
    if (job.status !== JobStatus.FAILED) {
      throw new ApiError(
        400,
        "Only failed jobs can be retried"
      );
    }

    // -----------------------------------
    // Move to Dead Letter Queue (DLQ)
    // -----------------------------------
    if (job.attempts >= 3) {
      await dlqQueue.add("dead-email", {
        originalJobId: job._id.toString(),
        name: job.name,
        email: job.email,
        error: job.error,
      });

      job.status = JobStatus.DLQ;

      await job.save();

      throw new ApiError(
        400,
        "Maximum retry limit exceeded. Job moved to Dead Letter Queue."
      );
    }

    // -----------------------------------
    // Retry in Main Queue
    // -----------------------------------
    const queueJob = await jobQueue.add("send-email", {
      name: job.name,
      email: job.email,
    });

    job.status = JobStatus.QUEUED;
    job.queueJobId = String(queueJob.id);
    job.error = null;
    job.attempts += 1;

    await job.save();

    return job;
  }
}

export default new JobService();