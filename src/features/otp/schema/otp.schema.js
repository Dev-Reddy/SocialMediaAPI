import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },

  otp: {
    code: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  verified: {
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    time: {
      type: Date,
      default: Date.now(),
    },
  },
});

export default otpSchema;
