"use server";

import pdf from "pdf-thumbnail";
import { PassThrough } from "stream";
import { streamToBuffer } from "./stream-to-buffer";

/**
 * Generates a preview image from a PDF file
 * @param file The PDF file or Blob to generate a preview from
 * @param quality Quality of the output JPEG
 * @returns A promise that resolves to a Buffer containing the JPEG image
 */
import sharp from "sharp";

export default async function generatePreviewImage(
  file: File | Blob,
  quality = 80
): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);

  const jpegBuffer = await sharp(pdfBuffer, { density: 150 })
    .jpeg({ quality })
    .toBuffer();

  return jpegBuffer;
}
