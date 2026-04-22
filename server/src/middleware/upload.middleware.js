import multer from "multer";
import { AppError } from "../utils/error.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new AppError("Unsupported file format", 415, "INVALID_FILE_TYPE"));
  }

  return cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

export const uploadProductImages = upload.array("images", 10);
export const uploadProfileImage = upload.single("profileImage");

export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new AppError("File too large", 413, "FILE_TOO_LARGE"));
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return next(new AppError("Too many files", 400, "VALIDATION_ERROR", { images: "Maximum 10 images allowed" }));
    }

    return next(new AppError(err.message, 400, "VALIDATION_ERROR"));
  }

  return next(err);
};
