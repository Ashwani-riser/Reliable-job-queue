import mongoose from "mongoose";
import ApiError from "../errors/ApiError";
import Job, { JobStatus } from "../models/job.model";
import { jobQueue } from "../queues/job.queue";

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

    job.queueJobId = queueJob.id;
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
}

export default new JobService();