// Centralized error-handling middleware for the REST API.
const errorHandlerMiddleware = (err, req, res, _next) => {
  // Set the default HTTP status code to 500 if none is provided.
  const statusCode =
    err.statusCode ||
    (err instanceof SyntaxError && err.status === 400 && "body" in err ? 400 : err.status) ||
    500;

  // Determine the error code based on the HTTP status.
  let errorCode = "INTERNAL_SERVER_ERROR";

  if (statusCode === 400) {
    errorCode = "BAD_REQUEST";
  } else if (statusCode === 401) {
    errorCode = "UNAUTHORIZED";
  } else if (statusCode === 403) {
    errorCode = "FORBIDDEN";
  } else if (statusCode === 404) {
    errorCode = "NOT_FOUND";
  } else if (statusCode === 409) {
    errorCode = "CONFLICT";
  } else if (statusCode === 422) {
    errorCode = "VALIDATION_ERROR";
  } else if (statusCode === 429) {
    errorCode = "RATE_LIMIT_EXCEEDED";
  }

  // Log unexpected server errors for debugging.
  if (statusCode >= 500) {
    console.error({
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      message: err.message,
      stack: err.stack,
    });
  }

  // Return a consistent JSON error response.
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: statusCode >= 500 ? "An unexpected server error occurred." : err.message,
    },
    requestId: req.id || null,
  });
};

export default errorHandlerMiddleware;
