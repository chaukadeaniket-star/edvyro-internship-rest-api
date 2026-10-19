import rateLimit from "express-rate-limit";

// Middleware to limit excessive requests to the API.
const rateLimiterMiddleware = rateLimit({
  // Time window during which requests are counted.
  windowMs: 15 * 60 * 1000,

  // Maximum number of requests allowed from one IP per window.
  limit: 100,

  // Include standard rate-limit information in response headers.
  standardHeaders: "draft-8",

  // Disable legacy rate-limit headers.
  legacyHeaders: false,

  // Return a consistent JSON response when the limit is exceeded.
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later.",
    },
  },
});

export default rateLimiterMiddleware;
