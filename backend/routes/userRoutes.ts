import express from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User";

const router = express.Router();

router.post("/save-user", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  let userId = req.body.userId;

  try {
    // If token is present, verify with Clerk
    if (token) {
      const session = await clerkClient.sessions.getSession(token);

      if (!session || session.status !== "active") {
        return res.status(401).json({ message: "Invalid or expired session." });
      }

      userId = session.userId;
    }

    // Check if userId was received
    if (!userId) {
      return res.status(400).json({ message: "Missing userId." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userId });

    if (!existingUser) {
      await User.create({ userId });
      console.log("✅ New user saved:", userId);
    } else {
      console.log("ℹ️ User already exists:", userId);
    }

    return res.status(200).json({ message: "User verified and saved.", userId });
  } catch (err: any) {
    console.error("❌ Error saving user:", err.message);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
