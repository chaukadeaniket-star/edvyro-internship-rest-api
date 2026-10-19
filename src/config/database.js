import { Pool } from "pg";
import env from "./env.js";
import logger from "./logger.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DB_SSL ? { rejectUnauthorized: true } : false,
});

pool.on("error", (error) => {
  logger.error({ err: error }, "Unexpected PostgreSQL pool error");
});

export const closeDatabase = () => pool.end();

const connectDB = async () => {
  await pool.query("SELECT 1");
  logger.info("PostgreSQL connected successfully");
  return pool;
};

export default connectDB;
export { pool };
