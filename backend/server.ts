import express, { Request, Response, NextFunction } from "express";
// Remove: import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import saveCareerDataRoute from "./routes/save-career-data";
import userData from "./routes/userData";

dotenv.config();

const app = express();

// Manual CORS handler - FIRST middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('Origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://skill-syncer.vercel.app'
  ];

  console.log(`🌍 Request from origin: ${origin}`);
  console.log(`🔍 Method: ${req.method}, Path: ${req.path}`);

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log(`✅ CORS allowed for: ${origin}`);
  } else if (!origin) {
    // Same-origin requests (like direct API testing)
    res.header('Access-Control-Allow-Origin', '*');
    console.log(`✅ CORS allowed for same-origin request`);
  } else {
    console.log(`❌ CORS blocked for: ${origin}`);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.header('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`✈️ Preflight request handled for ${req.path}`);
    return res.sendStatus(200);
  }

  next();
});

// Configure Helmet to not interfere
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Body parser
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

console.log("✅ MONGODB_URI loaded:", process.env.MONGODB_URI ? "Present" : "Missing");

// Routes
app.use("/api", userRoutes);
app.use("/api", saveCareerDataRoute);
app.use("/api", userData);

// Test routes
app.get("/", (req: Request, res: Response) => {
  res.json({ 
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
    origin: req.get('Origin'),
    cors: "manual"
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "healthy",
    cors: "manual-configured",
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});

// Error handler
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
  console.log(`🌐 Manual CORS enabled for: http://localhost:3000, http://localhost:3001, https://skill-syncer.vercel.app`);
});