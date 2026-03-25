import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getPlans, getMySubscription, createOrder, verifyPayment, cancelSubscription } from "../controllers/subscription.controller.js";

const router = express.Router();

router.get("/subscription/plans", getPlans);                            // Public
router.get("/subscription/me", authMiddleware, getMySubscription);      // Auth required
router.post("/subscription/create-order", authMiddleware, createOrder); // Auth required
router.post("/subscription/verify", authMiddleware, verifyPayment);     // Auth required
router.post("/subscription/cancel", authMiddleware, cancelSubscription); // Auth required

export default router;
