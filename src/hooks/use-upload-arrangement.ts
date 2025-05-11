import { Arrangement, Part } from "@/generated/prisma";
import { UseFileUploadReturn } from "@chakra-ui/react";
import { useState } from "react";
import { UseMetadataFormReturn } from "./use-metadata-form";

export enum UploadStatus {
  Idle,
  CreatingArrangement,
  UploadingParts
}

export interface UseUploadArrangementReturn {
  uploadStatus: UploadStatus;
  createArrangementAndUploadFiles: () => Promise<Arrangement>;
}

async function createAndUploadPart(arrangementId: string, file: File) {
  const partCreationResponse = await fetch(`/api/arrangements/${arrangementId}/parts`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      label: file.name.replace(".pdf", ""),
      is_full_score: false
    })
  });

  if (!partCreationResponse.ok) {
    throw new Error("Failed to create part");
  }

  const part: Part = await partCreationResponse.json();

  // await fetch(`/api/arrangements/${arrangementId}/parts/${part.part_id}/file`, {
  //   method: "POST",
  //   credentials: "include",
  //   body: file
  // }).catch((error) => {
  //   throw new Error("Failed to upload part file: " + error);
  // });

  const getUploadUrlResponse = await fetch(`/api/arrangements/${arrangementId}/parts/${part.part_id}/upload-url`, {
    method: "GET",
    credentials: "include"
  });

  if (!getUploadUrlResponse.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { url } = await getUploadUrlResponse.json();

  const uploadResponse = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type
    }
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file");
  }
  
  return part;
}

export function useUploadArrangement(fileUpload: UseFileUploadReturn, metadataForm: UseMetadataFormReturn): UseUploadArrangementReturn {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.Idle);

  async function createArrangementAndUploadFiles() {
    // Step 1: Create Arrangement
    setUploadStatus(UploadStatus.CreatingArrangement);

    const arrangementCreationResponse = await fetch("/api/arrangements", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        visibility: "public", // TODO: make this dynamic
        title: metadataForm.formContent.title,
        composers: metadataForm.formContent.composers.split(",").map((c) => c.trim()),
        arrangementType: metadataForm.formContent.arrangementType
      })
    });

    if (!arrangementCreationResponse.ok) {
      setUploadStatus(UploadStatus.Idle);
      throw new Error("Failed to create arrangement." + (await arrangementCreationResponse.json()).message);
    }

    const arrangement: Arrangement = await arrangementCreationResponse.json();

    // Step 2: Create and upload the parts
    setUploadStatus(UploadStatus.UploadingParts);

    const partPromises = fileUpload.acceptedFiles.map((file) => {
      return createAndUploadPart(arrangement.arrangement_id, file);
    });

    await Promise.all(partPromises).catch((error) => {
      setUploadStatus(UploadStatus.Idle);
      throw new Error("Failed to upload parts: " + error);
    });

    setUploadStatus(UploadStatus.Idle);

    return arrangement;
  }

  return { uploadStatus, createArrangementAndUploadFiles };
}
