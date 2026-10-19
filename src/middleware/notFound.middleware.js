// Middleware to handle requests to routes that do not exist.
const notFoundMiddleware = (req, res, next) => {
  // Create a 404 error with details about the requested route.
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);

  // Attach the HTTP status code to the error.
  error.statusCode = 404;

  // Pass the error to the centralized error handler.
  next(error);
};

export default notFoundMiddleware;
