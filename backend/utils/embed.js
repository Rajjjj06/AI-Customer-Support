import { pipeline } from "@xenova/transformers";

let embedder;
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export async function generateEmbedding(text) {
  if (!text || text.trim().length === 0) {
    throw new Error("Cannot embed empty text");
  }
  const model = await getEmbedder();
  const result = await model(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(result.data);
}