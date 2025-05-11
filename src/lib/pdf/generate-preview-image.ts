"use server";
import sharp from "sharp";

/**
 * Generates a preview image from a PDF file
 * @param file The PDF file or Blob to generate a preview from
 * @param pageIndex Index of the page to generate
 * @param density DPI for the conversion
 * @param quality Quality of the output JPEG
 * @returns A promise that resolves to a Buffer containing the JPEG image
 */

export async function generatePreviewImage(file: File | Blob, pageIndex = 0, density = 150, quality = 80): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);

  return await sharp(pdfBuffer, {
    density,
    page: pageIndex
  })
    .jpeg({ quality })
    .toBuffer();
}
