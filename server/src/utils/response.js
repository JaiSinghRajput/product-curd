const meta = () => ({
  timestamp: new Date().toISOString(),
  version: "1.0",
});

export const sendSuccess = (res, { statusCode = 200, message, data, pagination } = {}) => {
  const payload = {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
    ...(pagination ? { pagination } : {}),
    meta: meta(),
  };

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res,
  { statusCode = 500, message = "Operation failed", errorCode = "SERVER_ERROR", details = {} } = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    details,
    meta: meta(),
  });
};
