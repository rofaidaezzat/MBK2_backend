import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import contactMessageRoutes from "./routes/contactMessageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Global error handlers first
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/contact", contactMessageRoutes);
app.use("/api/v1/orders", orderRoutes);
// Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hayah_db";

if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}
// Validation: Warn if running in production but using localhost
if (process.env.NODE_ENV === 'production' && MONGO_URI.includes('localhost')) {
  console.warn('⚠️  WARNING: You are running in production but connecting to localhost. This will likely fail on Vercel/Heroku. Please set MONGO_URI environment variable.');
}

console.log('Attempting to connect to MongoDB...');

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected successfully to ${MONGO_URI.includes('localhost') ? 'Localhost' : 'Remote Cluster'}`))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    // It is often better to crash and restart than to run without DB
    // process.exit(1); 
  });

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});
