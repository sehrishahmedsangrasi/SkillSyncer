//models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  // You can add more fields here if needed
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
