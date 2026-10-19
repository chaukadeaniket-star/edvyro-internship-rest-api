import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Internship title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    domain: {
      type: String,
      required: [true, "Internship domain is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    stipend: {
      type: Number,
      required: [true, "Stipend is required"],
      min: 0,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index for efficient filtering by domain and status.
internshipSchema.index({ domain: 1, status: 1 });

const Internship = mongoose.model("Internship", internshipSchema);

export default Internship;
