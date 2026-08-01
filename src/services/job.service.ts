import mongoose from "mongoose";
import ApiError from "../errors/ApiError";
import Job from "../models/job.model";
import { jobQueue } from "../queues/job.queue";

export interface CreateJobData {
  name: string;
  email: string;
}

class JobService {
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

  async getAllJobs() {
    return await Job.find()
      .sort({ createdAt: -1 })
      .lean();
  }

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