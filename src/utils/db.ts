import config from "config";
import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(config.get("dbUri"));
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
