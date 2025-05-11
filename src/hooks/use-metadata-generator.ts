"use client";

import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { splitPdfByParts } from "@/lib/pdf/split-pdf-by-parts";
import { mergePDFs } from "@/lib/pdf/merge-pdfs";
import { PartInformation } from "@/app/api/utils/generate-metadata/route";

interface UseMetadataGeneratorProps {
  files: File[];
  onSuccess: (data: { title: string; composers: string[]; arrangement_type: string; parts: PartInformation[] }) => void;
  fileSplitCallback: (newFiles: File[]) => void;
}

interface MetadataResponse {
  title: string;
  composers: string[];
  arrangement_type: string;
  parts: PartInformation[];
}

export enum GenerationStatus {
  Idle,
  MergingFile,
  Uploading,
  WaitingForResponse,
}

export function useMetadataGenerator({ files, onSuccess, fileSplitCallback }: UseMetadataGeneratorProps) {
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>(GenerationStatus.Idle);

  const generateMetadata = async () => {
    if (files.length === 0) {
      toaster.create({ type: "warning", description: "Select at least one file to generate metadata." });
      return;
    }

    setGenerationStatus(GenerationStatus.MergingFile);

    try {
      const mergedPdfBytes = await mergePDFs(files);
      const mergedFile = new File([mergedPdfBytes], "merged.pdf", { type: "application/pdf" });

      const form = new FormData();
      form.append("files", mergedFile);

      setGenerationStatus(GenerationStatus.Uploading);

      const responsePromise = fetch("/api/utils/generate-metadata", {
        method: "POST",
        body: form
      });

      setGenerationStatus(GenerationStatus.WaitingForResponse);

      const res = await responsePromise;

      if (!res.ok) {
        toaster.create({ type: "error", description: JSON.stringify(await res.json()) });
        throw new Error(`HTTP ${res.status}`);
      }

      const data: MetadataResponse = await res.json();
      console.log(data);

      // Update files with split PDFs
      const splitFiles = await splitPdfByParts(mergedPdfBytes, data.parts);
      fileSplitCallback(splitFiles);

      // Call success callback with the data
      onSuccess(data);

      toaster.create({ type: "success", description: "Metadata generated successfully." });
    } catch (err) {
      console.error(err);
      toaster.create({ type: "error", description: "Something is wrong, try again later." + err });
    } finally {
      setGenerationStatus(GenerationStatus.Idle);
    }
  };

  return {
    generationStatus,
    generateMetadata
  };
}
