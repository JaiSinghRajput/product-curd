import Joi from "joi";

export const sendOtpSchema = Joi.object({
  emailOrPhone: Joi.string().trim().required(),
});

export const verifyOtpSchema = Joi.object({
  emailOrPhone: Joi.string().trim().required(),
  otp: Joi.string().pattern(/^\d{6}$/).required().messages({
    "string.pattern.base": "otp must be exactly 6 digits",
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().trim().required(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  removeProfileImage: Joi.boolean().optional(),
});
