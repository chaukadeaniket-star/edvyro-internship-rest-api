// Import internship services.
import * as internshipService from "../services/internship.service.js";

// Create a new internship.
export const createInternship = async (req, res, next) => {
  try {
    // Use validated request body.
    const internship = await internshipService.createInternship(req.validated.body);

    // Return the created internship.
    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      data: internship,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve all internships with pagination and filtering.
export const getAllInternships = async (req, res, next) => {
  try {
    // Use validated query parameters.
    const query = req.validated.query;

    const result = await internshipService.getAllInternships(query);

    // Return internships and pagination details.
    res.status(200).json({
      success: true,
      message: "Internships retrieved successfully",
      data: result.data,
      pagination: result.pagination,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve a single internship by ID.
export const getInternshipById = async (req, res, next) => {
  try {
    // Use validated route parameters.
    const { id } = req.validated.params;

    const internship = await internshipService.getInternshipById(id);

    res.status(200).json({
      success: true,
      message: "Internship retrieved successfully",
      data: internship,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

// Replace an existing internship.
export const updateInternship = async (req, res, next) => {
  try {
    // Use validated route parameters and request body.
    const { id } = req.validated.params;
    const internshipData = req.validated.body;

    const internship = await internshipService.updateInternship(id, internshipData);

    res.status(200).json({
      success: true,
      message: "Internship updated successfully",
      data: internship,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

// Partially update an existing internship.
export const patchInternship = async (req, res, next) => {
  try {
    // Use validated route parameters and request body.
    const { id } = req.validated.params;
    const internshipData = req.validated.body;

    const internship = await internshipService.patchInternship(id, internshipData);

    res.status(200).json({
      success: true,
      message: "Internship partially updated successfully",
      data: internship,
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an internship.
export const deleteInternship = async (req, res, next) => {
  try {
    // Use validated route parameters.
    const { id } = req.validated.params;

    await internshipService.deleteInternship(id);

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully",
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

// Export all internship controllers.
export default {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  patchInternship,
  deleteInternship,
};
