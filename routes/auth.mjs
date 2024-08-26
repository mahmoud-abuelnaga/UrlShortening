// imports
import express from "express";
import { validateSignup } from "../middlewares/auth.mjs";
import { signup } from "../controllers/auth.mjs";

const router = express.Router();
router.post("/signup", validateSignup, signup);

export { router as authRouter };
