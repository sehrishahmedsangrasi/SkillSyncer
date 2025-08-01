import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import saveCareerDataRoute from "./routes/save-career-data";
import userData from "./routes/userData";

dotenv.config();

const app = express();

// CORS Configuration - MUST come before other middleware
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://skill-syncer.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200
};

// Apply CORS first
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Configure Helmet to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Add request logging for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`📍 Origin: ${req.get('Origin')}`);
  console.log(`🔑 Authorization: ${req.get('Authorization') ? 'Present' : 'Missing'}`);
  next();
});

// Body parser
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

console.log("✅ Loaded MONGODB_URI:", process.env.MONGODB_URI ? "Present" : "Missing");

// Routes
app.use("/api", userRoutes);
app.use("/api", saveCareerDataRoute);
app.use("/api", userData);

// Test routes for debugging
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
    origin: req.get('Origin')
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    cors: "configured",
    origin: req.get('Origin')
  });
});

// Catch-all error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("💥 Server Error:", err);
  res.status(500).json({ 
    success: false, 
    error: "Internal server error",
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
});