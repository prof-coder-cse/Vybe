import express from "express";
import { getAIComments } from "../controllers/ai.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const aiRouter = express.Router();

aiRouter.post("/comments",getAIComments);

export default aiRouter;