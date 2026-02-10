import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import contactMessageRoutes from "./routes/contactMessageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";

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

if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

// Connect to Database
connectDB().then(() => {
  console.log("✅ Database connected successfully");
  // Only start listening if not in Vercel environment (or similar serverless)
  // Vercel exports the app, it doesn't run app.listen() directly in the same way for serverless functions
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}).catch(err => {
  console.error("❌ Database connection error:", err);
  process.exit(1);
});

// Export app for Vercel
export default app;
