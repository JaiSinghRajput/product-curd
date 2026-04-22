import { Router } from "express";
import Joi from "joi";
import authMiddleware from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { uploadErrorHandler, uploadProductImages } from "../../middleware/upload.middleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  listProductsController,
  updateProductController,
  updateProductStatusController,
} from "./product.controller.js";
import {
  createProductSchema,
  listProductsSchema,
  updateProductSchema,
  updateStatusSchema,
} from "./product.validation.js";

const productRouter = Router();

const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

productRouter.use(authMiddleware);

productRouter.get("/", validate(listProductsSchema, "query"), listProductsController);
productRouter.get("/:id", validate(idParamSchema, "params"), getProductController);
productRouter.post(
  "/",
  uploadProductImages,
  uploadErrorHandler,
  validate(createProductSchema),
  createProductController
);
productRouter.put(
  "/:id",
  validate(idParamSchema, "params"),
  uploadProductImages,
  uploadErrorHandler,
  validate(updateProductSchema),
  updateProductController
);
productRouter.patch(
  "/:id/status",
  validate(idParamSchema, "params"),
  validate(updateStatusSchema),
  updateProductStatusController
);
productRouter.delete("/:id", validate(idParamSchema, "params"), deleteProductController);

export default productRouter;
