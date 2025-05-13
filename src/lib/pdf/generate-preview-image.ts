"use server";

import pdf from "pdf-thumbnail";


export async function generatePreviewImage(pdfBuffer: Buffer): Promise<Buffer> {
  const previewImageBuffer = await pdf(
    pdfBuffer,
    {
      compress: {
        type: "jpeg",
        quality: 70
      }

    }
  )

  const buffer = await streamToBuffer(previewImageBuffer);

  return buffer;
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (error) => reject(error));
  });
}