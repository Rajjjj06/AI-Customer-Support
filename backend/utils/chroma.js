import { CloudClient } from "chromadb";
import dotenv from "dotenv";
import { generateEmbedding } from "./embed.js";

dotenv.config();

// Connect to Chroma Cloud using CloudClient
const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

// A custom embedding function class to satisfy ChromaDB
class MyEmbeddingFunction {
  async generate(texts) {
    return Promise.all(texts.map((text) => generateEmbedding(text)));
  }
}

const embeddingFunction = new MyEmbeddingFunction();

export async function getToCollection(collectionName) {
  const collection = await chromaClient.getOrCreateCollection({
    name: collectionName,
    embeddingFunction: embeddingFunction,
  });

  return collection;
}
