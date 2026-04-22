import User from "./user.model.js";
import { AppError } from "../../utils/error.js";
import { generateOtp, maskContact, resolveContact } from "../../utils/otp.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../../utils/jwt.js";
import { mapUser } from "../../utils/mapper.js";
import { sendOtpEmail } from "../../utils/mailer.js";
import env from "../../config/env.js";
import { deleteCloudinaryImage, uploadBufferToCloudinary } from "../../utils/cloudinary.js";

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_REQUEST_WINDOW_MS = 10 * 60 * 1000;
const OTP_REQUEST_LIMIT = 5;
const OTP_VERIFY_FAIL_LIMIT = 5;
const OTP_LOCK_MS = 15 * 60 * 1000;

const findUserByContact = (method, value) => {
  if (method === "email") {
    return User.findOne({ email: value.toLowerCase() });
  }
  return User.findOne({ phone: value });
};

export const sendOtp = async (emailOrPhone) => {
  const contact = resolveContact(emailOrPhone);

  if (!contact) {
    throw new AppError("Invalid email or phone format", 400, "VALIDATION_ERROR", {
      emailOrPhone: "Provide a valid email or 10-digit Indian phone number",
    });
  }

  let user = await findUserByContact(contact.method, contact.value);

  if (!user) {
    user = await User.create(
      contact.method === "email"
        ? { email: contact.value.toLowerCase() }
        : { phone: contact.value }
    );
  }

  const now = Date.now();
  const recentLogs = (user.otpRequestLogs || []).filter(
    (time) => now - new Date(time).getTime() <= OTP_REQUEST_WINDOW_MS
  );

  if (recentLogs.length >= OTP_REQUEST_LIMIT) {
    throw new AppError("Too many OTP requests", 429, "RATE_LIMIT_EXCEEDED");
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = new Date(now + OTP_EXPIRY_MS);
  user.otpVerified = false;
  user.otpRequestLogs = [...recentLogs, new Date(now)];

  if (contact.method !== "email") {
    throw new AppError("SMS OTP service is not configured", 400, "VALIDATION_ERROR", {
      emailOrPhone: "Use email for OTP login",
    });
  }

  if (env.nodeEnv === "development") {
    console.log(`[DEV OTP] ${contact.value} -> ${otp}`);
  }

  try {
    await sendOtpEmail({
      to: contact.value,
      otp,
    });
  } catch (error) {
    if (env.nodeEnv !== "development") {
      throw error;
    }
  }

  await user.save();

  return {
    method: contact.method,
    expiresIn: 300,
    maskedContact: maskContact(contact.value, contact.method),
  };
};

export const verifyOtp = async ({ emailOrPhone, otp }) => {
  const contact = resolveContact(emailOrPhone);

  if (!contact) {
    throw new AppError("Invalid email or phone format", 400, "VALIDATION_ERROR", {
      emailOrPhone: "Provide a valid email or 10-digit Indian phone number",
    });
  }

  const user = await findUserByContact(contact.method, contact.value);

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const now = new Date();

  if (user.otpLockUntil && user.otpLockUntil > now) {
    throw new AppError("Too many failed attempts. Try later", 429, "RATE_LIMIT_EXCEEDED");
  }

  if (!user.otp || !user.otpExpiry || user.otpExpiry < now) {
    throw new AppError("OTP expired", 400, "OTP_EXPIRED");
  }

  if (user.otp !== otp) {
    user.otpFailedAttempts = (user.otpFailedAttempts || 0) + 1;

    if (user.otpFailedAttempts >= OTP_VERIFY_FAIL_LIMIT) {
      user.otpLockUntil = new Date(Date.now() + OTP_LOCK_MS);
      user.otpFailedAttempts = 0;
    }

    await user.save();
    throw new AppError("Invalid OTP", 400, "INVALID_OTP");
  }

  user.otp = null;
  user.otpExpiry = null;
  user.otpVerified = true;
  user.otpFailedAttempts = 0;
  user.otpLockUntil = null;
  user.lastLogin = now;

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshTokens = [refreshToken, ...(user.refreshTokens || [])].slice(0, 10);
  await user.save();

  return {
    user: mapUser(user),
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    },
  };
};

export const refreshAccessToken = async (refreshToken) => {
  let payload;

  try {
    payload = verifyToken(refreshToken);
  } catch (error) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  if (payload.type !== "refresh") {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const user = await User.findById(payload.userId);

  if (!user || !(user.refreshTokens || []).includes(refreshToken)) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  return {
    accessToken: signAccessToken(user),
    expiresIn: 3600,
  };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return mapUser(user);
};

export const updateProfile = async ({ userId, body, file }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  const hasNameUpdate = body.name !== undefined;
  const removeProfileImage = body.removeProfileImage === true;

  if (!hasNameUpdate && !removeProfileImage && !file) {
    throw new AppError("Validation failed", 400, "VALIDATION_ERROR", {
      profile: "Provide a name or profile image change",
    });
  }

  const previousProfileImage = user.profileImage;

  if (hasNameUpdate) {
    user.name = body.name.trim();
  }

  if (file) {
    const uploaded = await uploadBufferToCloudinary({
      buffer: file.buffer,
      folder: `users/${userId.toString()}`,
      filename: `profile-${Date.now()}`,
    });

    user.profileImage = uploaded.secure_url;
  } else if (removeProfileImage) {
    user.profileImage = null;
  }

  await user.save();

  if (previousProfileImage && previousProfileImage !== user.profileImage) {
    deleteCloudinaryImage(previousProfileImage).catch(() => {});
  }

  return mapUser(user);
};

export const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId);

  if (!user) {
    return;
  }

  if (refreshToken) {
    user.refreshTokens = (user.refreshTokens || []).filter((token) => token !== refreshToken);
  } else {
    user.refreshTokens = [];
  }

  await user.save();
};
