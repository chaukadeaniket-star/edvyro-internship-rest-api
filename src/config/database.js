// Import Mongoose to connect to MongoDB.
import mongoose from "mongoose";

// Connect the application to MongoDB.
const connectDB = async () => {
  try {
    // Establish the database connection.
    await mongoose.connect(process.env.MONGODB_URI);

    // Log successful database connection.
    console.log("MongoDB connected successfully!");

    // Display the connected database name.
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    // Log the connection error.
    console.error("MongoDB connection failed:", error.message);

    // Forward the error to the caller.
    throw error;
  }
};

// Export the database connection function.
export default connectDB;
