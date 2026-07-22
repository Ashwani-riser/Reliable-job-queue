import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import logger from "../loggers/logger";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(
    {
      method: req.method,
      url: req.originalUrl,
      error: err.message,
      stack: err.stack,
    },
    "Request failed"
  );

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(
    new ApiError(500, "Internal Server Error")
  );
};

export default errorHandler;