import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    chatBot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatBot",
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        default: "Unknown Dashboard Test"
    }
}, { timestamps: true });

analyticsSchema.index({ chatBot: 1, createdAt: -1 }); // Fast querying per bot, sorted newest first

export default mongoose.model("Analytics", analyticsSchema);
