import type { ErrorRequestHandler } from "express";
import { logger } from "../utils/loggers.js";
import ApiError from "../errors/ApiError.js";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err.stack);

  let statusCode = 500;
  let message = " Internal Server Error ";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
