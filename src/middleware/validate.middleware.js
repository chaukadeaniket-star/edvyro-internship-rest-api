// Middleware to validate request body, query, and route parameters.

// Middleware factory to validate request data using Zod.
const validateMiddleware = (schema, property = "body") => {
  return (req, res, next) => {
    // Validate the selected request property against the provided schema.
    const result = schema.safeParse(req[property]);

    // If validation fails, return a structured 400 Bad Request response.
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || property,
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: errors,
        },
        requestId: req.id || null,
      });
    }

    // Store the validated and parsed data without modifying Express properties.
    req.validated = req.validated || {};
    req.validated[property] = result.data;

    // Pass control to the next middleware or route handler.
    next();
  };
};

export default validateMiddleware;
