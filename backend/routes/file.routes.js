import {
  createFile,
  remove,
  getFiles,
  getFileById,
} from "../controllers/file.controllers.js";
import express from "express";
import { uploadFile as upload } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/create/:id", authMiddleware, upload.single("file"), createFile);
router.get("/files/:id", authMiddleware, getFiles);
router.get("/file/:id", authMiddleware, getFileById);
router.delete("/file/:id", authMiddleware, remove);

export default router;
