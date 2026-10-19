// Import Vitest testing functions.
import { describe, it, expect } from "vitest";

// Import pagination utilities.
import { getPaginationOptions, getPaginationMetadata } from "../../src/utils/pagination.js";

describe("Pagination Utilities", () => {
  // Test default pagination values.
  it("should use default pagination values", () => {
    const result = getPaginationOptions();

    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
    });
  });

  // Test custom pagination values.
  it("should calculate pagination options correctly", () => {
    const result = getPaginationOptions({
      page: "3",
      limit: "20",
    });

    expect(result).toEqual({
      page: 3,
      limit: 20,
      skip: 40,
    });
  });

  // Test invalid page and limit values.
  it("should handle invalid pagination values", () => {
    const result = getPaginationOptions({
      page: "-2",
      limit: "invalid",
    });

    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
    });
  });

  // Test the maximum allowed page size.
  it("should restrict the limit to 100", () => {
    const result = getPaginationOptions({
      page: "1",
      limit: "500",
    });

    expect(result.limit).toBe(100);
  });

  // Test pagination metadata.
  it("should calculate pagination metadata correctly", () => {
    const result = getPaginationMetadata(2, 10, 45);

    expect(result).toEqual({
      page: 2,
      limit: 10,
      totalRecords: 45,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  // Test the first page.
  it("should indicate that the first page has no previous page", () => {
    const result = getPaginationMetadata(1, 10, 25);

    expect(result.hasPreviousPage).toBe(false);
    expect(result.hasNextPage).toBe(true);
  });

  // Test the last page.
  it("should indicate that the last page has no next page", () => {
    const result = getPaginationMetadata(3, 10, 25);

    expect(result.hasPreviousPage).toBe(true);
    expect(result.hasNextPage).toBe(false);
  });

  // Test empty results.
  it("should handle zero records", () => {
    const result = getPaginationMetadata(1, 10, 0);

    expect(result).toEqual({
      page: 1,
      limit: 10,
      totalRecords: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });
});
