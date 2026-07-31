//producer hai ya ,producer ka kam hai ki job ko queue me dalna. 


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

    const queueJob = await jobQueue.add(
      "send-email",
      {
        name: data.name,
        email: data.email,
      }
    );

    job.queueJobId = queueJob.id;
    await job.save();

    return job;
  }
}

export default new JobService();