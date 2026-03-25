import natural from "natural";

const tokenizer = new natural.SentenceTokenizer();

export function chunkText(text, chunkSize = 1000, overlap = 200) {
  const sentences = tokenizer.tokenize(text);

  const chunks = [];
  let currentSentences = [];

  for (const sentence of sentences) {
    const joined = currentSentences.join(" ");

    if ((joined + " " + sentence).length > chunkSize && currentSentences.length > 0) {
      chunks.push(joined.trim());

      // Roll back to sentences that fit within the overlap window
      const overlapSentences = [];
      let overlapLength = 0;

      for (let i = currentSentences.length - 1; i >= 0; i--) {
        const s = currentSentences[i];
        if (overlapLength + s.length + 1 <= overlap) {
          overlapSentences.unshift(s);
          overlapLength += s.length + 1;
        } else {
          break;
        }
      }

      currentSentences = [...overlapSentences, sentence];
    } else {
      currentSentences.push(sentence.trim());
    }
  }

  if (currentSentences.length > 0) {
    chunks.push(currentSentences.join(" ").trim());
  }

  return chunks;
}