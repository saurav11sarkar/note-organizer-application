import express from "express";
import { categoryController } from "./category.controller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware("admin", "user"), categoryController.createCategory);
router.get("/", authMiddleware("admin", "user"), categoryController.getCategories);
router.put("/:id", authMiddleware("admin", "user"), categoryController.updateCategory);
router.delete("/:id", authMiddleware("admin", "user"), categoryController.deleteCategory);
router.get("/:id", authMiddleware("admin", "user"), categoryController.getSingleCategory);


export const categoryRouter = router;