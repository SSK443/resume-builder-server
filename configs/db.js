

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongodbURI = process.env.MONGODB_URI;
    const projectName = "resume-builder";

    if (!mongodbURI) {
      throw new Error("❌ MONGODB_URI environment variable not set");
    }
    if(mongodbURI.endsWith('/')){
      mongodbURI=mongodbURI.slice(0,-1)
    }

    // Log connection events
    mongoose.connection.on("connected", () => {
      console.log("✅ Database connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Database connection error:", err);
    });

    // Connect to MongoDB
    await mongoose.connect(`${mongodbURI}/${projectName}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
