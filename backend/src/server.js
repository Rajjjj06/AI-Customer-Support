import app from "./app.js"
import {logger} from "../config/logger.js"
import dotenv from "dotenv"
import { generateEmbedding } from "../utils/embed.js";
dotenv.config()

const PORT = process.env.PORT || 5000;

// Pre-warm the embedding model so first upload/chat is fast
// This runs once at startup, downloads & caches the model in memory
logger.info("Warming up embedding model...");
generateEmbedding("warmup").then(() => {
    logger.info("Embedding model ready.");
}).catch((err) => {
    logger.warn("Embedding model warmup failed (non-fatal):", err.message);
});

app.listen(PORT, () => {
    logger.info(`Server is running on ${PORT}`);
    console.log("Server is running on "+PORT);
})