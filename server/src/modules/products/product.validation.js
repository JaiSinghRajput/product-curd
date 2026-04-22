import Joi from "joi";

const productTypes = ["Foods", "Electronics", "Clothes", "Beauty Products", "Others"];
const exchangeValues = ["Yes", "No"];
const statusValues = ["published", "unpublished"];

const numericString = Joi.alternatives().try(Joi.number(), Joi.string());

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  type: Joi.string().valid(...productTypes).required(),
  stock: numericString.required(),
  mrp: numericString.required(),
  price: numericString.required(),
  brand: Joi.string().trim().allow("", null).max(50).optional(),
  exchange: Joi.string().valid(...exchangeValues).optional(),
  description: Joi.string().allow("", null).optional(),
  removeImages: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional(),
  type: Joi.string().valid(...productTypes).optional(),
  stock: numericString.optional(),
  mrp: numericString.optional(),
  price: numericString.optional(),
  brand: Joi.string().trim().allow("", null).max(50).optional(),
  exchange: Joi.string().valid(...exchangeValues).optional(),
  description: Joi.string().allow("", null).optional(),
  removeImages: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(...statusValues).required(),
});

export const listProductsSchema = Joi.object({
  status: Joi.string().valid(...statusValues).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
