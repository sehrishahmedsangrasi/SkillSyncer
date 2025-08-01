// import express, { Request, Response } from "express";
// import { connectToDB } from "../models/utils/db";
// import UserData from "../models/userData"; // ✅ Model with education, experience, skills

// const router = express.Router();

// router.get("/userData/:id", async (req: Request, res: Response) => {
//   console.log("🛎️  /userData route hit with ID:", req.params.id);

//   try {
//     await connectToDB();
//     const user = await UserData.find({ userId: req.params.id });
//     console.log("Fetched UserData:", user);

//     if (user.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error("❌ Error fetching user:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// });

// export default router;
// routes/userRoutes.ts
import express, { Request, Response } from "express";
import { connectToDB } from "../models/utils/db";
import UserData from "../models/userData";

const router = express.Router();

router.get("/userData/:id", async (req: Request, res: Response) => {
  
  try {
    await connectToDB();

    const allDocs = await UserData.find({ userId: req.params.id });
    

    if (allDocs.length === 0) {
      return res.status(404).json({ message: "No data found for this user" });
    }

    return res.status(200).json(allDocs);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});
// routes/userRoutes.ts or similar
router.delete("/userData/:id", async (req: Request, res: Response) => {
  console.log("🛎️ /userData route hit with ID:", req.params.id);

  try {
    await connectToDB();

    const { id } = req.params;
    const deleted = await UserData.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting entry:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



export default router;
