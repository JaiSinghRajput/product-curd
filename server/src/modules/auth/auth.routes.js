import { Router } from "express";
import validate from "../../middleware/validate.middleware.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { uploadErrorHandler, uploadProfileImage } from "../../middleware/upload.middleware.js";
import { refreshTokenSchema, sendOtpSchema, updateProfileSchema, verifyOtpSchema } from "./auth.validation.js";
import {
  getProfileController,
  logoutController,
  refreshTokenController,
  sendOtpController,
  updateProfileController,
  verifyOtpController,
} from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/send-otp", validate(sendOtpSchema), sendOtpController);
authRouter.post("/verify-otp", validate(verifyOtpSchema), verifyOtpController);
authRouter.post("/refresh-token", validate(refreshTokenSchema), refreshTokenController);
authRouter.get("/profile", authMiddleware, getProfileController);
authRouter.patch(
  "/profile",
  authMiddleware,
  uploadProfileImage,
  uploadErrorHandler,
  validate(updateProfileSchema),
  updateProfileController
);
authRouter.post("/logout", authMiddleware, logoutController);

export default authRouter;
