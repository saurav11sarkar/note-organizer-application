import express from "express";
import { userController } from "./user.controller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refreshToken", userController.refeshToken); // Fixed typo

export const userRouter = router;