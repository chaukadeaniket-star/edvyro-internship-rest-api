import "dotenv/config";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { pool } from "../src/config/database.js";
import logger from "../src/config/logger.js";

const internships = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    title: "Backend Developer Intern",
    company: "EdVyro Technologies",
    domain: "Software Development",
    location: "Pune",
    duration: "3 months",
    stipend: 12000,
    description: "Build and maintain REST API features with the engineering team.",
    status: "active",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    title: "Data Analyst Intern",
    company: "Insight Labs",
    domain: "Data Science",
    location: "Remote",
    duration: "6 months",
    stipend: 15000,
    description: "Analyze product data and prepare reports for business teams.",
    status: "active",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    title: "Frontend Developer Intern",
    company: "Pixel Works",
    domain: "Web Development",
    location: "Mumbai",
    duration: "4 months",
    stipend: 10000,
    description: "Create accessible user interfaces with the product team.",
    status: "closed",
  },
];

export const seedDatabase = async (databasePool = pool) => {
  const client = await databasePool.connect();

  try {
    await client.query("BEGIN");

    for (const internship of internships) {
      await client.query(
        `INSERT INTO internships (
          id, title, company, domain, location, duration, stipend, description, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING`,
        [
          internship.id,
          internship.title,
          internship.company,
          internship.domain,
          internship.location,
          internship.duration,
          internship.stipend,
          internship.description,
          internship.status,
        ],
      );
    }

    await client.query("COMMIT");
    logger.info({ count: internships.length }, "Internship seed data inserted");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await seedDatabase();
  } catch (error) {
    logger.error({ err: error }, "Database seeding failed");
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
