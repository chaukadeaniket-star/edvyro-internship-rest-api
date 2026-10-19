import "dotenv/config";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { pool } from "../src/config/database.js";
import logger from "../src/config/logger.js";

export const migrateDatabase = async (databasePool = pool) => {
  const migration = await readFile(
    new URL("../migrations/001_create_internships.sql", import.meta.url),
    "utf8",
  );
  const client = await databasePool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(753190241)");
    await client.query(migration);
    await client.query("COMMIT");
    logger.info("PostgreSQL migrations completed");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await migrateDatabase();
  } catch (error) {
    logger.error({ err: error }, "Database migration failed");
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
