// Import testing utilities.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import connectDB from "../../src/config/database.js";

// Connect to MongoDB before running integration tests.
beforeAll(async () => {
  process.env.MONGODB_URI ??= "mongodb://127.0.0.1:27017/edvyro_internships_test";

  await connectDB();
});

// Close the MongoDB connection after testing.
afterAll(async () => {
  await mongoose.connection.close();
});

describe("EdVyro REST API Integration Tests", () => {
  // Test the health endpoint.
  it("should return a successful health check", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("EdVyro REST API is running");
    expect(response.body.requestId).toBeDefined();
  });

  // Test handling of nonexistent routes.
  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/api/v1/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  // Test rejection of invalid internship IDs.
  it("should reject an invalid internship ID", async () => {
    const response = await request(app).get("/api/v1/internships/invalid-id");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Test validation of an empty internship request.
  it("should reject an empty internship request", async () => {
    const response = await request(app).post("/api/v1/internships").send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
