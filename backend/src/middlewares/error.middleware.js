import { env } from "../config/env.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = "ROUTE_NOT_FOUND";
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Server error";
  let code = error.code || "SERVER_ERROR";

  if (error.name === "ZodError") {
    statusCode = 400;
    message = error.issues.map((issue) => issue.message).join(", ");
    code = "VALIDATION_ERROR";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
    code = "VALIDATION_ERROR";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "This email is already registered.";
    code = "DUPLICATE_EMAIL";
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    stack: env.nodeEnv === "production" ? undefined : error.stack,
  });
};
