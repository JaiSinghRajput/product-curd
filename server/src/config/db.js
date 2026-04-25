import mongoose from "mongoose";
import env from "./env.js";

const hasDatabaseInUri = (uri) => {
  const withoutProtocol = uri.replace(/^mongodb(?:\+srv)?:\/\//, "");
  const beforeQuery = withoutProtocol.split("?")[0];
  const slashIndex = beforeQuery.indexOf("/");

  if (slashIndex === -1) {
    return false;
  }

  return beforeQuery.slice(slashIndex + 1).trim().length > 0;
};

const addDbNameToUri = (uri, dbName) => {
  const [beforeQuery, query = ""] = uri.split("?");
  const normalized = beforeQuery.replace(/\/+$/, "");
  return `${normalized}/${dbName}${query ? `?${query}` : ""}`;
};

const connectDb = async () => {
  if (!env.dbUrl) {
    throw new Error("DB_URL is required");
  }

  const baseUri = env.dbUrl.trim();
  const dbUri = hasDatabaseInUri(baseUri)
    ? baseUri
    : addDbNameToUri(baseUri, env.dbName);

  try {
    await mongoose.connect(dbUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    if (error?.code === "ECONNREFUSED" && error?.syscall === "querySrv") {
      throw new Error(
        "MongoDB SRV DNS lookup failed. Use a standard mongodb:// connection string from MongoDB Compass (instead of mongodb+srv://), then restart the server."
      );
    }

    throw error;
  }
};

export default connectDb;
