import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const signAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email || null,
      type: "access",
    },
    env.jwtSecret,
    {
      algorithm: "HS256",
      expiresIn: env.jwtExpiry,
    }
  );
};

export const signRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      type: "refresh",
    },
    env.jwtSecret,
    {
      algorithm: "HS256",
      expiresIn: env.refreshTokenExpiry,
    }
  );
};

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
