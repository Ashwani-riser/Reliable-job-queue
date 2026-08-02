import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import jobService from "../services/job.service";
import { JobStatus } from "../models/job.model";
import ApiError from "../errors/ApiError";

class JobController {
  // Create Job
  createJob = asyncHandler(async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const job = await jobService.createJob({
      name,
      email,
    });

    return res.status(201).json(
      new ApiResponse(201, job, "Job added to queue successfully")
    );
  });

  // Get All Jobs
  getAllJobs = asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as JobStatus | undefined;

    // Validate status if provided
    if (status && !Object.values(JobStatus).includes(status)) {
      throw new ApiError(400, "Invalid job status");
    }

    const jobs = await jobService.getAllJobs(status);

    return res.status(200).json(
      new ApiResponse(200, jobs, "Jobs fetched successfully")
    );
  });

  // Get Job By Id
  getJobById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const job = await jobService.getJobById(id);

    return res.status(200).json(
      new ApiResponse(200, job, "Job fetched successfully")
    );
  });
 // Retry Failed Job
   retryJob = asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id as string;

      const job = await jobService.retryJob(id);

        return res.status(200).json(
          new ApiResponse(200, job, "Job retried successfully")
        );
  });

  
}

export default new JobController();