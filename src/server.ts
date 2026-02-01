import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import contactMessageRoutes from "./routes/contactMessageRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Global error handlers first
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/contact", contactMessageRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hayah_db";
console.log('MONGO_URI', MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected locally"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Don't exit, allow server to run even without DB
  });

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});
