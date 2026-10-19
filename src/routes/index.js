import { Router } from "express";

// Import internship routes.
import internshipRoutes from "./internship.routes.js";

// Initialize the main API router.
const router = Router();

// Register internship endpoints.
router.use("/internships", internshipRoutes);

export default router;
