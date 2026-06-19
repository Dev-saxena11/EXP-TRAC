import mongoose from 'mongoose';
import dotenv from 'dotenv';
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferredCurrency: { type: String, default: 'INR' },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;