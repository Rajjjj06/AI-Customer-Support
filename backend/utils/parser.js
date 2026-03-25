import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const pdfParse = async (url) => {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");
  const status = response.status;
  if (!response.ok || !contentType || !contentType.includes("pdf")) {
    throw new Error(
      `Failed to fetch PDF. Status: ${status}, Content-Type: ${contentType}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();

  // Optional: Debug - save buffer to disk for inspection
  // const fs = await import('fs');
  // fs.writeFileSync('debug_downloaded.pdf', Buffer.from(arrayBuffer));

  const blobLike = {
    arrayBuffer: async () => arrayBuffer,
    type: contentType || "application/pdf",
  };

  const loader = new PDFLoader(blobLike);
  const docs = await loader.load();
  return docs;
};
