"use client";
import { PDFDocument } from "pdf-lib";

/**
 * Merges multiple PDF files into a single PDF
 * @param files Array of PDF files to merge
 * @returns Promise resolving to a Uint8Array containing the merged PDF
 */

export default async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const src = await PDFDocument.load(arrayBuffer);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return merged.save();
}
