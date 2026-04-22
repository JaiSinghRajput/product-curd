export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = "SERVER_ERROR", details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}
