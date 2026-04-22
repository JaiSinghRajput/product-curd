import Product from "./product.model.js";
import { AppError } from "../../utils/error.js";
import { mapProduct } from "../../utils/mapper.js";
import { deleteCloudinaryImage, uploadBufferToCloudinary } from "../../utils/cloudinary.js";

const normalizeNumber = (value) => {
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

const normalizeRemoveImages = (removeImages) => {
  if (!removeImages) return [];

  if (Array.isArray(removeImages)) {
    return removeImages.filter(Boolean);
  }

  if (typeof removeImages === "string") {
    try {
      const parsed = JSON.parse(removeImages);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch (error) {
      return [removeImages];
    }

    return [removeImages];
  }

  return [];
};

const normalizeProductPayload = (payload) => {
  const normalized = { ...payload };

  if (payload.stock !== undefined) normalized.stock = normalizeNumber(payload.stock);
  if (payload.mrp !== undefined) normalized.mrp = normalizeNumber(payload.mrp);
  if (payload.price !== undefined) normalized.price = normalizeNumber(payload.price);

  return normalized;
};

const validatePricing = (productLike) => {
  if (productLike.price <= 0 || productLike.mrp <= 0) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", {
      price: "Price and MRP must be greater than 0",
    });
  }

  if (productLike.price > productLike.mrp) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", {
      price: "Price must be less than or equal to MRP",
    });
  }
};

const sanitizeFilename = (name = "image") => {
  return String(name)
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 50);
};

const normalizeImageList = (images) => (Array.isArray(images) ? images.filter(Boolean) : []);

const filesToImages = async (files = [], userId) => {
  const uploads = files.map(async (file) => {
    const filename = `${Date.now()}-${sanitizeFilename(file.originalname)}`;
    const result = await uploadBufferToCloudinary({
      buffer: file.buffer,
      folder: `products/${userId}`,
      filename,
    });

    return result.secure_url;
  });

  return Promise.all(uploads);
};

export const listProducts = async ({ userId, status, page, limit }) => {
  const query = { userId };
  if (status) {
    query.status = status;
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 20;
  const safePage = Math.max(1, pageNumber);
  const safeLimit = Math.max(1, Math.min(100, limitNumber));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    Product.countDocuments(query),
  ]);

  return {
    data: items.map(mapProduct),
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
};

export const getProductById = async ({ productId, userId }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404, "NOT_FOUND");
  }

  if (product.userId.toString() !== userId.toString()) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  return mapProduct(product);
};

export const createProduct = async ({ userId, body, files }) => {
  const payload = normalizeProductPayload(body);
  validatePricing(payload);

  const images = await filesToImages(files, userId.toString());

  const product = await Product.create({
    userId,
    name: payload.name,
    type: payload.type,
    stock: payload.stock,
    mrp: payload.mrp,
    price: payload.price,
    brand: payload.brand || "",
    exchange: payload.exchange || "Yes",
    status: "unpublished",
    images,
    description: payload.description || "",
  });

  return mapProduct(product);
};

export const updateProduct = async ({ productId, userId, body, files }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404, "NOT_FOUND");
  }

  if (product.userId.toString() !== userId.toString()) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  const payload = normalizeProductPayload(body);
  const removeImages = normalizeRemoveImages(payload.removeImages);
  const uploadedImages = await filesToImages(files, userId.toString());
  const existingImages = normalizeImageList(product.images);

  let nextImages = [...existingImages];
  if (removeImages.length > 0) {
    nextImages = nextImages.filter((img) => !removeImages.includes(img));
    await Promise.all(removeImages.map((image) => deleteCloudinaryImage(image)));
  }

  if (uploadedImages.length > 0) {
    nextImages = uploadedImages;
    await Promise.all(existingImages.map((image) => deleteCloudinaryImage(image)));
  }

  product.name = payload.name ?? product.name;
  product.type = payload.type ?? product.type;
  product.stock = payload.stock ?? product.stock;
  product.mrp = payload.mrp ?? product.mrp;
  product.price = payload.price ?? product.price;
  product.brand = payload.brand ?? product.brand;
  product.exchange = payload.exchange ?? product.exchange;
  product.description = payload.description ?? product.description;
  product.images = nextImages;

  validatePricing(product);

  await product.save();

  return mapProduct(product);
};

export const updateProductStatus = async ({ productId, userId, status }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404, "NOT_FOUND");
  }

  if (product.userId.toString() !== userId.toString()) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  product.status = status;
  await product.save();

  return {
    id: product._id.toString(),
    status: product.status,
    updatedAt: product.updatedAt,
  };
};

export const deleteProduct = async ({ productId, userId }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404, "NOT_FOUND");
  }

  if (product.userId.toString() !== userId.toString()) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  await Promise.all(normalizeImageList(product.images).map((image) => deleteCloudinaryImage(image)));
  await Product.deleteOne({ _id: product._id });
};
