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
//   origin: ['http://localhost:3000', 'http://localhost:3001','https://skill-syncer.vercel.app'], // Add your frontend URLs
//   credentials: true
// }));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });
// app.use(helmet());
// app.use((req, res, next) => {
//   res.setHeader("Cache-Control", "no-store"); // or adjust as needed
//   next();
// });
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
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import saveCareerDataRoute from "./routes/save-career-data";
import userData from "./routes/userData";

dotenv.config();

const app = express();

// Middleware (Order matters)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://skill-syncer.vercel.app"
  ],
  credentials: true
}));

app.use(helmet());

// Prevent caching
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI as string;
mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log("✅ Loaded MONGODB_URI:", mongoURI);
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api", userRoutes);
app.use("/api", saveCareerDataRoute);
app.use("/api", userData);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// Start server - CORRECTED VERSION
// Using parseInt
// Start server
const PORT = Number(process.env.PORT) || 8080;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Accessible at: http://0.0.0.0:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});