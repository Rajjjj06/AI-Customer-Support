import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  chunkId: String,
  content: String,
  vectorString: [Number],
  metadata: mongoose.Schema.Types.Mixed,
});

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    chatBot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatBot",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mimetype: String,
    size: Number,
    chunks: [chunkSchema],

    isProceed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

fileSchema.index({ user: 1, chatBot: 1, createdAt: -1 });

export default mongoose.model("File", fileSchema);
