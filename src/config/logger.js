// Import Pino for structured application logging.
import pino from "pino";

// Create a reusable application logger.
const logger = pino({
  // Set the logging level based on the environment.
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  // Add application information to every log entry.
  base: {
    application: "edvyro-rest-api",
    environment: process.env.NODE_ENV || "development",
  },

  // Use readable output during local development.
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export default logger;
