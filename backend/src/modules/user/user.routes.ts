import express from "express";
import { userController } from "./user.controller";
import authMiddleware from "../../middlewares/authMiddleware";
import uploadImage from "../../middlewares/multerUploadImage";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refreshToken", userController.refeshToken); // Fixed typo
router.get("/", authMiddleware("admin", "user"), userController.getProfile);
router.put("/", authMiddleware("admin", "user"), uploadImage("image"), userController.updatedProfile);

export const userRouter = router;
