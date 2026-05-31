import express from "express";
import { parseTransactionNLP } from "../controllers/aiController.js";
import { authMiddleware } from "../middlewares/auth.js";

const aiRouter = express.Router();

aiRouter.post("/parse", authMiddleware, parseTransactionNLP);

export default aiRouter;
