// Import Zod for request validation.
import { z } from "zod";

// Define validation rules for internship fields.
const internshipFields = {
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  company: z
    .string()
    .trim()
    .min(2, "Company name must contain at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),

  domain: z
    .string()
    .trim()
    .min(2, "Domain must contain at least 2 characters")
    .max(100, "Domain cannot exceed 100 characters"),

  location: z
    .string()
    .trim()
    .min(2, "Location must contain at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),

  duration: z
    .string()
    .trim()
    .min(1, "Duration is required")
    .max(50, "Duration cannot exceed 50 characters"),

  stipend: z.number().finite().min(0, "Stipend cannot be negative"),

  description: z
    .string()
    .trim()
    .min(10, "Description must contain at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  status: z.enum(["active", "closed"]),
};

// Validate data when creating an internship.
export const createInternshipSchema = z.object(internshipFields).strict();

// Validate data when replacing an internship.
export const updateInternshipSchema = z.object(internshipFields).strict();

// Validate data when partially updating an internship.
export const patchInternshipSchema = z
  .object(internshipFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update",
  });

// Validate internship IDs in route parameters.
export const internshipIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid internship ID"),
});

// Validate pagination, filtering, and sorting query parameters.
export const internshipQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    domain: z.string().trim().min(1).optional(),

    location: z.string().trim().min(1).optional(),

    status: z.enum(["active", "closed"]).optional(),

    search: z.string().trim().min(1).max(100).optional(),

    sortBy: z.enum(["createdAt", "title", "stipend"]).default("createdAt"),

    order: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();
