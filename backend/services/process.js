import { pdfParse } from "../utils/parser.js";
import { chunkText } from "../utils/chunking.js";
import { generateEmbedding } from "../utils/embed.js";
import { getToCollection } from "../utils/chroma.js";
import { extractImportantText } from "./extractImportantText.js";
import { v4 as uuidv4 } from "uuid";

export async function processDocument(signedUrl, botId) {
  // 1. Parse PDF
  const docs = await pdfParse(signedUrl);
  const fullText = docs.map((d) => d.pageContent).join("\n");

  // 2. Extract important content via LLM
  const cleanedText = await extractImportantText(fullText);

  // 3. Chunk the cleaned text
  const chunks = chunkText(cleanedText);

  // 4. Get ChromaDB collection
  const collection = await getToCollection("documents");

  // 5. Embed + store each chunk
  const processedChunks = await Promise.all(
    chunks.map(async (chunkContent, index) => {
      const chunkId = uuidv4();
      const embedding = await generateEmbedding(chunkContent);

      // Add to ChromaDB
      await collection.add({
        ids: [chunkId],
        embeddings: [embedding],
        documents: [chunkContent],
        metadatas: [{ index, source: signedUrl, botId: botId.toString() }],
      });

      return {
        chunkId,
        content: chunkContent,
        vectorString: embedding, // keep as string for Mongo
        metadata: { index, source: signedUrl, botId: botId.toString() },
      };
    })
  );

  return processedChunks;
}