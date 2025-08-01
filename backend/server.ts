// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import userRoutes from "./routes/userRoutes";
// import saveCareerDataRoute from "./routes/save-career-data";
// import userData from "./routes/userData";


// dotenv.config();


// const app = express();

// // Middleware
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001'], // Add your frontend URLs
//   credentials: true
// }));
// app.use(helmet());
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI as string)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));
//   console.log("✅ Loaded MONGODB_URI:", process.env.MONGODB_URI);


// // Routes
// app.use("/api", userRoutes);
// app.use("/api",saveCareerDataRoute);
// app.use("/api",userData)

// // Test route
// app.get("/", (req, res) => {
//   res.send("Backend is running!");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS middleware - FIRST
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('Origin');
  console.log(`🌍 ${req.method} ${req.path} from origin: ${origin}`);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'https://skill-syncer.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cache-Control', 'no-cache');
  
  console.log('✅ CORS headers set for:', origin);
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('✈️ Preflight request - sending 200');
    return res.sendStatus(200);
  }
  
  next();
});

// Body parser
app.use(express.json());

// Test route
app.get("/", (req: Request, res: Response) => {
  console.log('📍 Root route accessed');
  res.json({ 
    message: "NEW Backend is running with CORS fix!",
    timestamp: new Date().toISOString(),
    version: "v2.0"
  });
});

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  console.log('🏥 Health check accessed');
  res.json({ 
    status: "healthy",
    version: "v2.0",
    cors: "enabled",
    timestamp: new Date().toISOString()
  });
});

// Save career data route - DIRECTLY in server
app.post("/api/save-career-data", (req: Request, res: Response) => {
  console.log('💾 POST /api/save-career-data received');
  console.log('📦 Body:', req.body);
  console.log('🔑 Auth header:', req.get('Authorization') ? 'Present' : 'Missing');
  console.log('📍 Origin:', req.get('Origin'));
  
  try {
    const { skills, education, experience } = req.body;
    
    if (!skills || skills.length === 0) {
      console.log('❌ No skills provided');
      return res.status(400).json({
        success: false,
        error: "Skills are required"
      });
    }
    
    console.log('✅ Processing skills:', skills);
    
    // Success response
    res.json({
      success: true,
      message: "Career data received successfully!",
      data: { skills, education, experience },
      timestamp: new Date().toISOString(),
      version: "v2.0"
    });
    
    console.log('✅ Response sent successfully');
    
  } catch (error: any) {
    console.error('💥 Error in save-career-data:', error);
    res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message
    });
  }
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NEW Server v2.0 running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: https://skill-syncer.vercel.app`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});