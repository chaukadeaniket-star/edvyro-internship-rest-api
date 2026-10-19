// Utility functions for API pagination.

// Normalize pagination parameters.
export const getPaginationOptions = (query = {}) => {
  // Set the default page number.
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);

  // Limit the maximum number of records per page.
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 10));

  // Calculate the number of records to skip.
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

// Generate pagination metadata.
export const getPaginationMetadata = (page, limit, totalRecords) => {
  // Calculate the total number of pages.
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    page,
    limit,
    totalRecords,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalPages > 0,
  };
};
