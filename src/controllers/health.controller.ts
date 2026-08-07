import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import mongoose from "mongoose";
import redis from "../config/redis";

class HealthController {
  getHealth = asyncHandler(async (_req: Request, res: Response) => {
    const mongoStatus =
      mongoose.connection.readyState === 1 ? "UP" : "DOWN";

    let redisStatus = "DOWN";

    try {
      await redis.ping();
      redisStatus = "UP";
    } catch {
      redisStatus = "DOWN";
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          server: "UP",
          mongodb: mongoStatus,
          redis: redisStatus,
          uptime: `${Math.floor(process.uptime())} seconds`,
          timestamp: new Date(),
        },
        "Health check successful"
      )
    );
  });
}

export default new HealthController();