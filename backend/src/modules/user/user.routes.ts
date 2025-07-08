import express from "express";
import { userController } from "./user.controller";
import authMiddleware from "../../middlewares/authMiddleware";
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post(
  "/refeshToken",
  userController.refeshToken
);

export const userRouter = router;
