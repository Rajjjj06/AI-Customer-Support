import {login, getUser} from "../controllers/user.controllers.js"
import {authMiddleware} from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.post("/login", login);

router.get("/me", authMiddleware, getUser);

export default router;
