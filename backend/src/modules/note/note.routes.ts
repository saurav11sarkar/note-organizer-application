import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { noteController } from "./note.controller";
const router = express.Router();

router.post("/", authMiddleware("admin", "user"), noteController.createNode);
router.get("/", authMiddleware("admin", "user"), noteController.getNotes);

export const noteRoutes = router;
