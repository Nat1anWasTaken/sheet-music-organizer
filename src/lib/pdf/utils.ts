"use client";

import { PDFDocument } from "pdf-lib";
import { PartInformation } from "@/app/api/generate-metadata/route";

/**
 * Merges multiple PDF files into a single PDF
 * @param files Array of PDF files to merge
 * @returns Promise resolving to a Uint8Array containing the merged PDF
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const src = await PDFDocument.load(arrayBuffer);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return merged.save();
}

/**
 * Splits a merged PDF into separate files based on part information
 * @param mergedPdfBytes The merged PDF as Uint8Array or ArrayBuffer
 * @param parts Array of part information objects containing start/end pages and labels
 * @returns Promise resolving to an array of File objects
 */
export async function splitPdfByParts(mergedPdfBytes: Uint8Array | ArrayBuffer, parts: PartInformation[]): Promise<File[]> {
  const srcDoc = await PDFDocument.load(mergedPdfBytes);

  return Promise.all(
    parts.map(async (part) => {
      const doc = await PDFDocument.create();

      // Pages are zero-indexed internally
      const pageCount = part.end_page - part.start_page + 1;
      const pageIndices = Array.from({ length: pageCount }, (_, i) => part.start_page - 1 + i);

      const copiedPages = await doc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((p) => doc.addPage(p));

      const bytes = await doc.save();
      return new File([bytes], `${part.label}.pdf`, {
        type: "application/pdf",
      });
    }),
  );
}