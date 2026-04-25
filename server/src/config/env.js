import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME || "productr",
  jwtSecret: process.env.JWT_SECRET || "change_this_secret",
  jwtExpiry: Number(process.env.JWT_EXPIRY || 3600),
  refreshTokenExpiry: Number(process.env.REFRESH_TOKEN_EXPIRY || 604800),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  smtpFrom: process.env.SMTP_FROM,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};

export default env;
