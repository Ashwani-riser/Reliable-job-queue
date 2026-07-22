import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import errorHandler from "./middlewares/error.middleware";

const app = express();
app.use(errorHandler);

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Compress API Responses
 */
app.use(compression());

/**
 * Parse JSON Request Body
 */
app.use(express.json());

/**
 * Health Check Route
 */
app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

export default app;