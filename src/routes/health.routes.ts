// health.routes.ts

import { Router } from "express";
import ApiResponse from "../utils/ApiResponse";

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      { status: "OK" },
      "Server is running successfully"
    )
  );
});

export default healthRouter;