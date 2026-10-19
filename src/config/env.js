// Import Zod for environment variable validation.
import { z } from "zod";

// Define the environment variable schema.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

// Validate environment variables.
const result = envSchema.safeParse(process.env);

// Stop startup if the configuration is invalid.
if (!result.success) {
  console.error("Invalid environment configuration:");

  console.error(
    result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  );

  process.exit(1);
}

// Export validated environment variables.
const env = result.data;

export default env;
