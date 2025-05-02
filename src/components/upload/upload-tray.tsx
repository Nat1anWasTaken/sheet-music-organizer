"use client";
import { Box, useDialog, useFileUpload, VStack } from "@chakra-ui/react";
import Dropzone from "@/components/upload/dropzone";
import { useState } from "react";
import ConfirmMergeDialog from "@/components/upload/confirm-merge-dialog";
import { useMetadataGenerator } from "@/hooks/use-metadata-generator";
import MetadataForm from "@/components/upload/metadata-form";

export default function UploadTray() {
  const fileUpload = useFileUpload({
    maxFiles: 20,
    maxFileSize: 100 * 1024 * 1024,
    accept: "application/pdf",
  });

  const [title, setTitle] = useState("");
  const [composers, setComposers] = useState("");
  const [arrangementType, setArrangementType] = useState("");

  const confirmMergeDialog = useDialog();

  const { generationStatus, generateMetadata } = useMetadataGenerator({
    files: fileUpload.acceptedFiles,
    onSuccess: (data) => {
      setTitle(data.title);
      setComposers(data.composers.join(", "));
      setArrangementType(data.arrangement_type);
    },
    onFilesUpdate: (newFiles) => {
      // Replace the files in the fileUpload
      fileUpload.acceptedFiles.splice(0, fileUpload.acceptedFiles.length, ...newFiles);
    },
  });

  return (
    <Box width={{ base: "full", md: "xl" }} border={"solid"} borderWidth={"1px"} borderColor={"border"} p={4} rounded={"md"}>
      <VStack gap={4}>
        <Dropzone fileUpload={fileUpload} />

        {fileUpload.acceptedFiles.length > 0 ? (
          <>
            <MetadataForm
              title={title}
              composers={composers}
              arrangementType={arrangementType}
              generationStatus={generationStatus}
              onTitleChange={(e) => setTitle(e.target.value)}
              onComposersChange={(e) => setComposers(e.target.value)}
              onArrangementTypeChange={(e) => setArrangementType(e.target.value)}
              onGenerateClick={() => confirmMergeDialog.setOpen(true)}
              onUploadClick={() => console.log("Upload clicked")}
            />
            <ConfirmMergeDialog value={confirmMergeDialog} confirmCallback={generateMetadata} />
          </>
        ) : (
          <></>
        )}
      </VStack>
    </Box>
  );
}
