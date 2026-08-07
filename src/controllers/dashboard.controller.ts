import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import dashboardService from "../services/dashboard.service";

class DashboardController {
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getStats();

    return res.status(200).json(
      new ApiResponse(
        200,
        stats,
        "Dashboard statistics fetched successfully"
      )
    );
  });
}

export default new DashboardController();