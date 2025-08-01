import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { verifyToken } from "@clerk/backend";
import CareerData from "../models/CareerData";
import { connectToDB } from "../models/utils/db";

dotenv.config();

const router = express.Router();

router.post("/save-career-data", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const sessionClaims = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const userId = sessionClaims.sub;

    await connectToDB();

    const { education, experience, skills } = req.body;

    console.log("📦 Received data:", { education, experience, skills });

    // Convert objects to arrays if they exist and have data
    const educationArray = education && Object.values(education).some((v: any) => v.trim() !== "") 
      ? [education] 
      : [];
    
    const experienceArray = experience && Object.values(experience).some((v: any) => v.trim() !== "") 
      ? [experience] 
      : [];

    console.log("🔄 Processed arrays:", { 
      educationArray, 
      experienceArray, 
      skills: skills || [] 
    });

    const newEntry = new CareerData({
      userId,
      education: educationArray,
      experience: experienceArray,
      skills: skills || [],
    });

    await newEntry.save();
    console.log("✅ Data saved successfully");

    return res.status(200).json({ success: true, message: "Career data saved" });
  } catch (error: any) {
    console.error("❌ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save career data",
    });
  }
});

export default router;