import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";
import { AppError } from "./error.js";

if (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
}

const ensureCloudinaryConfigured = () => {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new AppError("Cloudinary is not configured", 500, "SERVER_ERROR");
  }
};

export const uploadBufferToCloudinary = ({ buffer, folder, filename }) => {
  ensureCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );

    stream.end(buffer);
  });
};

export const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") {
    return null;
  }

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

export const deleteCloudinaryImage = async (url) => {
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};

export const buildCloudinaryProxyUrl = (url) => {
  if (!url) {
    return null;
  }

  return `/api/media/proxy?url=${encodeURIComponent(url)}`;
};
