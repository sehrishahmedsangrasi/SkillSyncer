// models/UserData.ts
import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  education: [
    {
      favSubject: String,
      degree: String,
      fieldOfStudy: String,
    },
  ],
  experience: [
    {
      jobTitle: String,
      company: String,
      years: String,
    },
  ],
  skills: [String], // Array of skill strings
});

const UserData =
  mongoose.models.UserData || mongoose.model("UserData", userDataSchema, "careerdatas");


export default UserData;
