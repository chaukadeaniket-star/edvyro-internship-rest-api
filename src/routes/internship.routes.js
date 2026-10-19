import { Router } from "express";

// Import internship controllers.
import * as internshipController from "../controllers/internship.controller.js";

// Import validation middleware.
import validateMiddleware from "../middleware/validate.middleware.js";

// Import validation schemas.
import {
  createInternshipSchema,
  updateInternshipSchema,
  patchInternshipSchema,
  internshipIdSchema,
  internshipQuerySchema,
} from "../validators/internship.validator.js";

const router = Router();

// GET /api/v1/internships
// Retrieve internships with pagination, filtering, and sorting.
router.get(
  "/",
  validateMiddleware(internshipQuerySchema, "query"),
  internshipController.getAllInternships,
);

// GET /api/v1/internships/:id
// Retrieve one internship by ID.
router.get(
  "/:id",
  validateMiddleware(internshipIdSchema, "params"),
  internshipController.getInternshipById,
);

// POST /api/v1/internships
// Create a new internship.
router.post(
  "/",
  validateMiddleware(createInternshipSchema, "body"),
  internshipController.createInternship,
);

// PUT /api/v1/internships/:id
// Replace an existing internship.
router.put(
  "/:id",
  validateMiddleware(internshipIdSchema, "params"),
  validateMiddleware(updateInternshipSchema, "body"),
  internshipController.updateInternship,
);

// PATCH /api/v1/internships/:id
// Partially update an existing internship.
router.patch(
  "/:id",
  validateMiddleware(internshipIdSchema, "params"),
  validateMiddleware(patchInternshipSchema, "body"),
  internshipController.patchInternship,
);

// DELETE /api/v1/internships/:id
// Delete an internship.
router.delete(
  "/:id",
  validateMiddleware(internshipIdSchema, "params"),
  internshipController.deleteInternship,
);

export default router;
