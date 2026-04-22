import * as authService from "./auth.service.js";
import { sendSuccess } from "../../utils/response.js";

export const sendOtpController = async (req, res, next) => {
  try {
    const data = await authService.sendOtp(req.body.emailOrPhone);

    return sendSuccess(res, {
      statusCode: 200,
      message: "OTP sent successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyOtpController = async (req, res, next) => {
  try {
    const data = await authService.verifyOtp(req.body);

    return sendSuccess(res, {
      statusCode: 200,
      message: "OTP verified successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const data = await authService.refreshAccessToken(req.body.refreshToken);

    return sendSuccess(res, {
      statusCode: 200,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProfileController = async (req, res, next) => {
  try {
    const data = await authService.getProfile(req.user._id);

    return sendSuccess(res, {
      statusCode: 200,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProfileController = async (req, res, next) => {
  try {
    const data = await authService.updateProfile({
      userId: req.user._id,
      body: req.body,
      file: req.file,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Profile updated successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    await authService.logout(req.user._id, req.body?.refreshToken);

    return sendSuccess(res, {
      statusCode: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(error);
  }
};
