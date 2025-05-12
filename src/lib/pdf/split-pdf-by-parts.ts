"use client";
import { PartInformation } from "@/app/api/utils/generate-metadata/route";
import { PDFDocument } from "pdf-lib";

/**
 * Splits a merged PDF into separate files based on part information
 * @param mergedPdfBytes The merged PDF as Uint8Array or ArrayBuffer
 * @param parts Array of part information objects containing start/end pages and labels
 * @returns Promise resolving to an array of File objects
 */

export default async function splitPdfByParts(mergedPdfBytes: Uint8Array | ArrayBuffer, parts: PartInformation[]): Promise<File[]> {
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
        type: "application/pdf"
      });
    })
  );
}
