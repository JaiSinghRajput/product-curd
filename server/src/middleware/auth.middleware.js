import User from "../modules/auth/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/error.js";

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const payload = verifyToken(token);

    if (payload.type !== "access") {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    req.user = user;
    req.accessToken = token;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
    }

    return next(error);
  }
};

export default authMiddleware;
