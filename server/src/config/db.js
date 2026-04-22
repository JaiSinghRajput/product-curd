import mongoose from "mongoose";
import env from "./env.js";

const connectDb = async () => {
  if (!env.dbUrl) {
    throw new Error("DB_URL is required");
  }

  await mongoose.connect(env.dbUrl, {
    autoIndex: true,
  });
};

export default connectDb;
