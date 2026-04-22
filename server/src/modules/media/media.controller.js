import { AppError } from "../../utils/error.js";

const allowedHosts = new Set(["res.cloudinary.com"]);

export const proxyImageController = async (req, res, next) => {
  try {
    const sourceUrl = req.query.url;

    if (!sourceUrl || typeof sourceUrl !== "string") {
      throw new AppError("Image url is required", 400, "VALIDATION_ERROR");
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(sourceUrl);
    } catch (error) {
      throw new AppError("Invalid image url", 400, "VALIDATION_ERROR");
    }

    if (!allowedHosts.has(parsedUrl.hostname)) {
      throw new AppError("Unsupported image host", 400, "VALIDATION_ERROR");
    }

    const response = await fetch(parsedUrl.toString());

    if (!response.ok) {
      throw new AppError("Unable to fetch image", 502, "UPSTREAM_ERROR");
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(buffer);
  } catch (error) {
    return next(error);
  }
};