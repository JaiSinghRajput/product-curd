import mongoose from "mongoose";
import env from "./env.js";
const DB_Name = "productr";

const connectDb = async () => {
  if (!env.dbUrl) {
    throw new Error("DB_URL is required");
  }

  await mongoose.connect(`${env.dbUrl}/${DB_Name}`, {
    autoIndex: true,
  });
};

export default connectDb;
