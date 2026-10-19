import express from "express";

import helmet from "helmet";

// Import middleware.
import requestIdMiddleware from "./middleware/requestId.middleware.js";
import rateLimiterMiddleware from "./middleware/rateLimiter.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import errorHandlerMiddleware from "./middleware/errorHandler.middleware.js";

// Import API routes.
import apiRoutes from "./routes/index.js";

// Initialize Express application.
const app = express();

// 1. Assign a unique ID to every request.
app.use(requestIdMiddleware);

// 2. Apply security-related HTTP headers.
app.use(helmet());

// 3. Parse incoming JSON request bodies.
app.use(express.json({ limit: "1mb" }));

// 4. Parse URL-encoded request bodies.
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// 5. Apply rate limiting.
app.use(rateLimiterMiddleware);

// 6. API welcome endpoint.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EdVyro REST API",
    version: "1.0.0",
    endpoints: {
      health: "/api/v1/health",
      internships: "/api/v1/internships",
    },
    documentation: "/docs/api-examples.md",
    requestId: req.id,
  });
});

// 7. Health-check endpoint.
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EdVyro REST API is running",
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
});

// 8. Register API routes.
app.use("/api/v1", apiRoutes);

// 9. Handle requests to nonexistent routes.
app.use(notFoundMiddleware);

// 10. Handle application errors centrally.
app.use(errorHandlerMiddleware);

export default app;
