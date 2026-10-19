// Import Mongoose for database operations.
import mongoose from "mongoose";

// Import the Internship model.
import Internship from "../models/internship.model.js";

// Create a new internship.
export const createInternship = async (internshipData) => {
  return await Internship.create(internshipData);
};

// Retrieve internships with pagination, filtering, searching, and sorting.
export const getAllInternships = async ({
  page = 1,
  limit = 10,
  filters = {},
  sortBy = "createdAt",
  order = "desc",
}) => {
  // Prepare the database query.
  const query = {};

  // Filter internships by domain.
  if (filters.domain) {
    query.domain = {
      $regex: `^${escapeRegex(filters.domain)}$`,
      $options: "i",
    };
  }

  // Filter internships by location.
  if (filters.location) {
    query.location = {
      $regex: `^${escapeRegex(filters.location)}$`,
      $options: "i",
    };
  }

  // Filter internships by status.
  if (filters.status) {
    query.status = filters.status;
  }

  // Search across relevant internship fields.
  if (filters.search) {
    const searchTerm = escapeRegex(filters.search);

    query.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { company: { $regex: searchTerm, $options: "i" } },
      { domain: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Count matching internships for pagination.
  const totalRecords = await Internship.countDocuments(query);

  // Retrieve the requested page.
  const data = await Internship.find(query)
    .sort({
      [sortBy]: order === "asc" ? 1 : -1,
      _id: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    data,
    totalRecords,
  };
};

// Retrieve a single internship by ID.
export const getInternshipById = async (id) => {
  // Validate the MongoDB ObjectId.
  validateObjectId(id);

  const internship = await Internship.findById(id).lean();

  // Return 404 when the internship does not exist.
  if (!internship) {
    const error = new Error("Internship not found");
    error.statusCode = 404;
    throw error;
  }

  return internship;
};

// Replace an existing internship using PUT.
export const updateInternship = async (id, internshipData) => {
  // Validate the MongoDB ObjectId.
  validateObjectId(id);

  // Replace the existing document while preserving its ID.
  const internship = await Internship.findOneAndReplace({ _id: id }, internshipData, {
    new: true,
    runValidators: true,
  }).lean();

  // Return 404 when the internship does not exist.
  if (!internship) {
    const error = new Error("Internship not found");
    error.statusCode = 404;
    throw error;
  }

  return internship;
};

// Partially update an existing internship using PATCH.
export const patchInternship = async (id, internshipData) => {
  // Validate the MongoDB ObjectId.
  validateObjectId(id);

  const internship = await Internship.findByIdAndUpdate(
    id,
    { $set: internshipData },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  // Return 404 when the internship does not exist.
  if (!internship) {
    const error = new Error("Internship not found");
    error.statusCode = 404;
    throw error;
  }

  return internship;
};

// Delete an internship by ID.
export const deleteInternship = async (id) => {
  // Validate the MongoDB ObjectId.
  validateObjectId(id);

  const internship = await Internship.findByIdAndDelete(id);

  // Return 404 when the internship does not exist.
  if (!internship) {
    const error = new Error("Internship not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: internship._id,
    deleted: true,
  };
};

// Validate MongoDB ObjectIds before database operations.
const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid internship ID");
    error.statusCode = 400;
    throw error;
  }
};

// Escape special regular-expression characters in search input.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
