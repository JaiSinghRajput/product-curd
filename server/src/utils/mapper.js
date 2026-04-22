import { buildCloudinaryProxyUrl } from "./cloudinary.js";

export const mapUser = (user) => ({
  id: user._id.toString(),
  name: user.name || null,
  email: user.email || null,
  phone: user.phone || null,
  profileImage: buildCloudinaryProxyUrl(user.profileImage),
});

export const mapProduct = (product) => ({
  id: product._id.toString(),
  name: product.name,
  type: product.type,
  stock: product.stock,
  mrp: product.mrp,
  price: product.price,
  brand: product.brand,
  exchange: product.exchange,
  status: product.status,
  images: Array.isArray(product.images) ? product.images : [],
  imageCount: Array.isArray(product.images) ? product.images.length : 0,
  description: product.description,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});
