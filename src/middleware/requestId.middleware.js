import { randomUUID } from "node:crypto";

// Middleware to generate and track a unique ID for every incoming request.
const requestIdMiddleware = (req, res, next) => {
  // Check whether a valid request ID already exists in the request headers.
  // Generate a new UUID if no request ID is provided.
  const requestId = randomUUID();

  // Attach the unique request ID to the request object.
  // Other middleware, controllers, and services can access req.id.
  req.id = requestId;

  // Include the request ID in the response headers for debugging and tracking.
  res.setHeader("X-Request-ID", requestId);

  // Pass control to the next middleware or route handler.
  next();
};

export default requestIdMiddleware;
