import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { noteController } from "./note.controller";
const router = express.Router();

router.post("/", authMiddleware("admin", "user"), noteController.createNode);
router.get("/", authMiddleware("admin", "user"), noteController.getNotes);
router.get("/:id", authMiddleware("admin", "user"), noteController.getNoteById);
router.delete(
  "/:id",
  authMiddleware("admin", "user"),
  noteController.deletedById
);
router.put("/:id", authMiddleware("admin", "user"), noteController.updatedById);

export const noteRoutes = router;
