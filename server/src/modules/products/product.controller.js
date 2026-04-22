import * as productService from "./product.service.js";
import { sendSuccess } from "../../utils/response.js";

export const listProductsController = async (req, res, next) => {
  try {
    const query = req.validatedQuery || req.query;

    const { data, pagination } = await productService.listProducts({
      userId: req.user._id,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    return sendSuccess(res, {
      statusCode: 200,
      data,
      pagination,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProductController = async (req, res, next) => {
  try {
    const data = await productService.getProductById({
      productId: req.params.id,
      userId: req.user._id,
    });

    return sendSuccess(res, {
      statusCode: 200,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProductController = async (req, res, next) => {
  try {
    const data = await productService.createProduct({
      userId: req.user._id,
      body: req.body,
      files: req.files,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Product created successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProductController = async (req, res, next) => {
  try {
    const data = await productService.updateProduct({
      productId: req.params.id,
      userId: req.user._id,
      body: req.body,
      files: req.files,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Product updated successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProductStatusController = async (req, res, next) => {
  try {
    const data = await productService.updateProductStatus({
      productId: req.params.id,
      userId: req.user._id,
      status: req.body.status,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Product status updated",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProductController = async (req, res, next) => {
  try {
    await productService.deleteProduct({
      productId: req.params.id,
      userId: req.user._id,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
