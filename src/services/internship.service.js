// Import internship repository functions.
import * as internshipRepository from "../repositories/internship.repository.js";
import { getPaginationOptions } from "../utils/pagination.js";

// Create a new internship.
export const createInternship = async (internshipData) => {
  return await internshipRepository.createInternship(internshipData);
};

// Retrieve internships with pagination, filtering, and sorting.
export const getAllInternships = async (query) => {
  const { page, limit } = getPaginationOptions(query);

  // Prepare filters.
  const filters = {};

  if (query.domain) {
    filters.domain = query.domain;
  }

  if (query.location) {
    filters.location = query.location;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.search) {
    filters.search = query.search;
  }

  // Validate sorting options.
  const sortBy = ["createdAt", "title", "stipend"].includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const order = query.order === "asc" ? "asc" : "desc";

  // Retrieve internships from the repository.
  const result = await internshipRepository.getAllInternships({
    page,
    limit,
    filters,
    sortBy,
    order,
  });

  // Return data with pagination information.
  return {
    data: result.data,
    pagination: {
      page,
      limit,
      totalRecords: result.totalRecords,
      totalPages: Math.ceil(result.totalRecords / limit),
    },
  };
};

// Retrieve one internship by ID.
export const getInternshipById = async (id) => {
  return await internshipRepository.getInternshipById(id);
};

// Replace an existing internship.
export const updateInternship = async (id, internshipData) => {
  return await internshipRepository.updateInternship(id, internshipData);
};

// Partially update an existing internship.
export const patchInternship = async (id, internshipData) => {
  return await internshipRepository.patchInternship(id, internshipData);
};

// Delete an internship.
export const deleteInternship = async (id) => {
  return await internshipRepository.deleteInternship(id);
};
