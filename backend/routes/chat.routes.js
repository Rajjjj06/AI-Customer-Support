import { createChatBot, getBotById, getBots, deleteBot, chatWithBot, getAnalytics } from "../controllers/chatBot.controllers.js";
import { authMiddleware } from "../middleware/auth.js";
import express from "express";
import cors from "cors";

const router = express.Router();

router.post("/create", authMiddleware, createChatBot);
router.get("/bots", authMiddleware, getBots);
router.get("/bot/:id", authMiddleware, getBotById);
router.delete("/bot/:id", authMiddleware, deleteBot);
router.get("/bot/:id/analytics", authMiddleware, getAnalytics);
// Public endpoint - open CORS so any external site can call it for the embedded widget
router.post("/bot/:id/chat", cors(), chatWithBot);

export default router;
