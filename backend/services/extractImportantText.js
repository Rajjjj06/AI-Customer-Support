import groq from "../config/groq.js";

export async function extractImportantText(fileContent) {
  // Instead of using an LLM to summarize (which destroys data and truncates it), 
  // we just clean the raw text with formatting rules so the full document gets embedded!
  const cleanedText = fileContent
    .replace(/\s+/g, " ") // Remove excess whitespace
    .replace(/_{2,}/g, "") // Remove weird underline borders
    .replace(/\*{2,}/g, "") // Remove excessive asterisks
    .trim();

  // Return the FULL 12 pages of cleaned text so `chunking.js` can slice it up properly!
  return cleanedText;
}