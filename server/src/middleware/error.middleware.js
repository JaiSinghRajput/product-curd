import { sendError } from "../utils/response.js";

export const notFoundMiddleware = (req, res) => {
  return sendError(res, {
    statusCode: 404,
    message: "Resource not found",
    errorCode: "NOT_FOUND",
  });
};

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const errorCode = err.errorCode || "SERVER_ERROR";
  const details = err.details || {};

  return sendError(res, {
    statusCode,
    message,
    errorCode,
    details,
  });
};
