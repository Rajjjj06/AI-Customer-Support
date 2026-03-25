import express from "express";
import { morganStream } from "../config/logger.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "../config/db.js";

import userRoutes from "../routes/user.routes.js";
import botRoutes from "../routes/chat.routes.js";
import fileRoutes from "../routes/file.routes.js";
import subscriptionRoutes from "../routes/subscription.routes.js";

connectDB();

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(helmet());

// Make sure to strip any trailing slash from the env variable!
const frontendUrl = (process.env.FRONTEND_URL);
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(morgan("combined", { stream: morganStream }));

app.use("/api/v1", userRoutes);
app.use("/api/v1", botRoutes);
app.use("/api/v1", fileRoutes);
app.use("/api/v1", subscriptionRoutes);

export default app;
