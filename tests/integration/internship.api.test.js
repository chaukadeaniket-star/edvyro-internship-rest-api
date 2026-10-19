import "dotenv/config";
import { randomUUID } from "node:crypto";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const createdIds = [];
let app;
let pool;
let migrateDatabase;

const databaseTarget = (connectionString) => {
  const url = new URL(connectionString);
  return `${url.hostname.toLowerCase()}:${url.port || "5432"}${url.pathname}`;
};

if (!testDatabaseUrl) {
  console.warn(
    "Skipping PostgreSQL integration tests: set TEST_DATABASE_URL to a dedicated test database.",
  );
}

describe.skipIf(!testDatabaseUrl)("EdVyro REST API PostgreSQL integration tests", () => {
  beforeAll(async () => {
    if (
      process.env.DATABASE_URL &&
      databaseTarget(process.env.DATABASE_URL) === databaseTarget(testDatabaseUrl)
    ) {
      throw new Error("TEST_DATABASE_URL must point to a database separate from DATABASE_URL.");
    }

    process.env.DATABASE_URL = testDatabaseUrl;
    ({ default: app } = await import("../../src/app.js"));
    ({ pool } = await import("../../src/config/database.js"));
    ({ migrateDatabase } = await import("../../scripts/migrate.js"));

    await migrateDatabase(pool);
  });

  afterEach(async () => {
    if (createdIds.length) {
      await pool.query("DELETE FROM internships WHERE id = ANY($1::uuid[])", [createdIds]);
      createdIds.length = 0;
    }
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
  });

  const makeInternship = (overrides = {}) => {
    const token = randomUUID().slice(0, 8);

    return {
      title: `Software Intern ${token}`,
      company: `Example Company ${token}`,
      domain: `Engineering ${token}`,
      location: `Pune ${token}`,
      duration: "3 months",
      stipend: 12000,
      description: "Build useful software features with the engineering team.",
      status: "active",
      ...overrides,
    };
  };

  const createInternship = async (data) => {
    const response = await request(app).post("/api/v1/internships").send(data);

    if (response.status === 201) {
      createdIds.push(response.body.data._id);
    }

    return response;
  };

  it("checks health and gives unknown routes a structured 404", async () => {
    const health = await request(app).get("/api/v1/health");
    expect(health.status).toBe(200);
    expect(health.body.success).toBe(true);
    expect(health.body.message).toBe("EdVyro REST API is running");
    expect(health.body.requestId).toBeDefined();

    const missing = await request(app).get("/api/v1/unknown-route");
    expect(missing.status).toBe(404);
    expect(missing.body.error.code).toBe("NOT_FOUND");
  });

  it("validates required fields, stipend, and internship status", async () => {
    const empty = await request(app).post("/api/v1/internships").send({});
    expect(empty.status).toBe(400);
    expect(empty.body.error.code).toBe("VALIDATION_ERROR");

    const invalidStipend = await createInternship(makeInternship({ stipend: "12000" }));
    expect(invalidStipend.status).toBe(400);

    const invalidStatus = await createInternship(makeInternship({ status: "pending" }));
    expect(invalidStatus.status).toBe(400);
  });

  it("rejects malformed UUIDs and returns 404 for well-formed missing UUIDs", async () => {
    const invalid = await request(app).get("/api/v1/internships/not-a-uuid");
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.code).toBe("VALIDATION_ERROR");

    const missing = await request(app).get(
      "/api/v1/internships/20000000-0000-4000-8000-000000000001",
    );
    expect(missing.status).toBe(404);
    expect(missing.body.error.message).toBe("Internship not found");
  });

  it("creates, reads, patches, replaces, and deletes an internship", async () => {
    const input = makeInternship();
    const created = await createInternship(input);

    expect(created.status).toBe(201);
    expect(created.body.success).toBe(true);
    expect(created.body.data).toMatchObject(input);
    expect(created.body.data._id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(created.body.data.createdAt).toBeDefined();
    expect(created.body.data.updatedAt).toBeDefined();
    expect(created.body.requestId).toBeDefined();

    const id = created.body.data._id;
    const read = await request(app).get(`/api/v1/internships/${id}`);
    expect(read.status).toBe(200);
    expect(read.body.data._id).toBe(id);

    const patched = await request(app).patch(`/api/v1/internships/${id}`).send({ stipend: 15000 });
    expect(patched.status).toBe(200);
    expect(patched.body.data.stipend).toBe(15000);
    expect(patched.body.data.title).toBe(input.title);

    const replacement = { ...input, title: `Replacement ${randomUUID().slice(0, 8)}` };
    const replaced = await request(app).put(`/api/v1/internships/${id}`).send(replacement);
    expect(replaced.status).toBe(200);
    expect(replaced.body.data).toMatchObject(replacement);
    expect(replaced.body.data._id).toBe(id);

    const deleted = await request(app).delete(`/api/v1/internships/${id}`);
    expect(deleted.status).toBe(200);
    expect(deleted.body.message).toBe("Internship deleted successfully");

    const nowMissing = await request(app).get(`/api/v1/internships/${id}`);
    expect(nowMissing.status).toBe(404);

    const deleteMissing = await request(app).delete(`/api/v1/internships/${id}`);
    expect(deleteMissing.status).toBe(404);
  });

  it("filters, searches, sorts, and paginates only matching records", async () => {
    const token = randomUUID().slice(0, 8);
    const domain = `Platform ${token}`;
    const location = `Remote ${token}`;

    for (const [title, stipend] of [
      [`Platform Analyst ${token}`, 10000],
      [`Platform Engineer ${token}`, 20000],
      [`Platform Designer ${token}`, 15000],
    ]) {
      const created = await createInternship(makeInternship({ title, domain, location, stipend }));
      expect(created.status).toBe(201);
    }

    const firstPage = await request(app).get("/api/v1/internships").query({
      domain: domain.toLowerCase(),
      location: location.toLowerCase(),
      page: 1,
      limit: 2,
      sortBy: "stipend",
      order: "desc",
    });

    expect(firstPage.status).toBe(200);
    expect(firstPage.body.data).toHaveLength(2);
    expect(firstPage.body.data.map(({ stipend }) => stipend)).toEqual([20000, 15000]);
    expect(firstPage.body.pagination).toMatchObject({
      page: 1,
      limit: 2,
      totalRecords: 3,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false,
    });

    const secondPage = await request(app)
      .get("/api/v1/internships")
      .query({ domain, location, page: 2, limit: 2, sortBy: "stipend", order: "desc" });
    expect(secondPage.body.data).toHaveLength(1);
    expect(secondPage.body.data[0].stipend).toBe(10000);

    const search = await request(app)
      .get("/api/v1/internships")
      .query({ search: `Analyst ${token}` });
    expect(search.status).toBe(200);
    expect(search.body.data).toHaveLength(1);
    expect(search.body.data[0].title).toContain("Analyst");
  });

  it("returns a structured 500 response when PostgreSQL fails", async () => {
    const query = vi
      .spyOn(pool, "query")
      .mockRejectedValueOnce(new Error("simulated database failure"));

    try {
      const response = await request(app).get("/api/v1/internships");
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INTERNAL_SERVER_ERROR");
      expect(response.body.error.message).toBe("An unexpected server error occurred.");
      expect(response.body.requestId).toBeDefined();
    } finally {
      query.mockRestore();
    }
  });
});
