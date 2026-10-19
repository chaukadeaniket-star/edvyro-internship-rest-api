// Custom error class for handling API errors consistently.
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    // Initialize the standard JavaScript Error.
    super(message);

    // Set the error name.
    this.name = "ApiError";

    // Store the HTTP status code.
    this.statusCode = statusCode;

    // Store optional validation or error details.
    this.details = details;

    // Capture the stack trace.
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
