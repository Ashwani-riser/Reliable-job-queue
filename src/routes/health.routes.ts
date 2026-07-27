import { Router } from "express";
import ApiResponse from "../utils/ApiResponse";

const router = Router();

router.get("/", (_req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: "OK",
        uptime: process.uptime(),
      },
      "Server is healthy"
    )
  );
});

export default router;