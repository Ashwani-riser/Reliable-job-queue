import Job from "../models/job.model";
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

  // Get All Jobs
  async getAllJobs() {
    const jobs = await Job.find().sort({
      createdAt: -1,
    });

    return jobs;
  }
}

export default new JobService();