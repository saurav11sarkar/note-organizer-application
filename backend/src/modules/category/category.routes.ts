import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { categoryController } from "./category.controller";
const router = express.Router();

router.post(
  "/",
  authMiddleware("admin", "user"),
  categoryController.createCategory
);

router.get(
  "/",
  authMiddleware("admin", "user"),
  categoryController.getCategories
);

router.put(
  "/:id",
  authMiddleware("admin", "user"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authMiddleware("admin", "user"),
  categoryController.deletedCategory
);

export const categoryRouter = router;
