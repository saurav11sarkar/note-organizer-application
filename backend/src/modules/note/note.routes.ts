import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { noteController } from "./note.controller";
import uploadImage from "../../middlewares/multerUploadImage";

const router = express.Router();

router.post(
  "/",
  authMiddleware("admin", "user"),
  uploadImage("image"),
  noteController.createNode
);
router.get("/", authMiddleware("admin", "user"), noteController.getNotes);
router.get("/:id", authMiddleware("admin", "user"), noteController.getNoteById);
router.delete(
  "/:id",
  authMiddleware("admin", "user"),
  noteController.deletedById
);
router.put(
  "/:id",
  authMiddleware("admin", "user"),
  uploadImage("image"),
  noteController.updatedById
);

export const noteRoutes = router;
