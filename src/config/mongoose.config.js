import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
  try {
    console.log("Connecting to MongoDB using Mongoose");
    await mongoose.connect(url);
    console.log("Connected to MongoDB using Mongoose");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};
