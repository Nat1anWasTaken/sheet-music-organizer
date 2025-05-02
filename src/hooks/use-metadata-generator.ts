"use client";

import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { mergePDFs, splitPdfByParts } from "@/lib/pdf/utils";
import { PartInformation } from "@/app/api/generate-metadata/route";

interface UseMetadataGeneratorProps {
  files: File[];
  onSuccess: (data: { title: string; composers: string[]; arrangement_type: string; parts: PartInformation[] }) => void;
  onFilesUpdate: (newFiles: File[]) => void;
}

interface MetadataResponse {
  title: string;
  composers: string[];
  arrangement_type: string;
  parts: PartInformation[];
}

export function useMetadataGenerator({ files, onSuccess, onFilesUpdate }: UseMetadataGeneratorProps) {
  const [generating, setGenerating] = useState(false);

  const generateMetadata = async () => {
    if (files.length === 0) {
      toaster.create({ type: "warning", description: "Select at least one file to generate metadata." });
      return;
    }

    setGenerating(true);

    try {
      const mergedPdfBytes = await mergePDFs(files);
      const mergedFile = new File([mergedPdfBytes], "merged.pdf", { type: "application/pdf" });

      const form = new FormData();
      form.append("files", mergedFile);

      const res = await fetch("/api/generate-metadata", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        toaster.create({ type: "error", description: JSON.stringify(await res.json()) });
        throw new Error(`HTTP ${res.status}`);
      }

      const data: MetadataResponse = await res.json();
      console.log(data);

      // Update files with split PDFs
      const splitFiles = await splitPdfByParts(mergedPdfBytes, data.parts);
      onFilesUpdate(splitFiles);

      // Call success callback with the data
      onSuccess(data);

      toaster.create({ type: "success", description: "Metadata generated successfully." });
    } catch (err) {
      console.error(err);
      toaster.create({ type: "error", description: "Something is wrong, try again later." });
    } finally {
      setGenerating(false);
    }
  };

  return {
    generating,
    generateMetadata,
  };
}
