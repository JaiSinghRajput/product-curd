import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import env from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";
import mediaRouter from "./modules/media/media.routes.js";
import productRouter from "./modules/products/product.routes.js";
import securityHeadersMiddleware from "./middleware/security.middleware.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.js";
import { sendSuccess } from "./utils/response.js";

const app = express();

app.use(helmet());
app.use(securityHeadersMiddleware);
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: "Server is healthy",
    data: {
      env: env.nodeEnv,
    },
  });
});

app.use("/api/auth", authRouter);
app.use("/api/media", mediaRouter);
app.use("/api/products", productRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
