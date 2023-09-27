import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
