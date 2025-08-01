// models/CareerData.ts
import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  favSubject: String,
  degree: String,
  fieldOfStudy: String,
});

const ExperienceSchema = new mongoose.Schema({
  jobTitle: String,
  description: String,
});

const CareerDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  education: [EducationSchema],     // Allow multiple entries
  experience: [ExperienceSchema],   // Allow multiple entries
  skills: [String],
});

export default mongoose.models.CareerData || mongoose.model("CareerData", CareerDataSchema);
