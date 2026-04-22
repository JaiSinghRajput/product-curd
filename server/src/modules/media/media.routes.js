import { Router } from "express";
import { proxyImageController } from "./media.controller.js";

const mediaRouter = Router();

mediaRouter.get("/proxy", proxyImageController);

export default mediaRouter;