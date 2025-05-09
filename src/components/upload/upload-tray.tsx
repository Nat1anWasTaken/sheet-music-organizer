"use client";
import { Box, useDialog, useFileUpload, UseFileUploadReturn, VStack } from "@chakra-ui/react";
import Dropzone from "@/components/upload/dropzone";
import { createContext } from "react";
import { useMetadataGenerator } from "@/hooks/use-metadata-generator";
import MetadataForm from "@/components/upload/metadata-form";
import { ConfirmGenerateDialog } from "@/components/upload/dialogs/confirm-generate-dialog";
import { useMetadataForm } from "@/hooks/use-metadata-form";
import { GenerateOrUpload } from "@/components/upload/generate-or-upload";
import { ConfirmUploadDialog } from "@/components/upload/dialogs/confirm-upload-dialog";

export const UploadTrayContext = createContext<UseFileUploadReturn | null>(null);

export default function UploadTray() {
  const fileUpload = useFileUpload({
    maxFiles: 20,
    maxFileSize: 100 * 1024 * 1024,
    accept: "application/pdf"
  });

  const confirmGenerateDialog = useDialog();
  const confirmUploadDialog = useDialog();

  const metadataForm = useMetadataForm();

  const { generationStatus, generateMetadata } = useMetadataGenerator({
    files: fileUpload.acceptedFiles,
    onSuccess: (data) => {
      metadataForm.setFormContent({
        title: data.title,
        composers: data.composers.join(", "),
        arrangementType: data.arrangement_type
      });
    },
    fileSplitCallback: (newFiles) => {
      fileUpload.acceptedFiles.splice(0, fileUpload.acceptedFiles.length, ...newFiles);
    }
  });

  const uploadFiles = () => {
    fetch("/api/upload");
  };

  return (
    <UploadTrayContext.Provider value={fileUpload}>
      <Box width={{ base: "full", md: "xl" }} border={"solid"} borderWidth={"1px"} borderColor={"border"} p={4} rounded={"md"}>
        <VStack gap={4}>
          <Dropzone fileUpload={fileUpload} />

          {fileUpload.acceptedFiles.length > 0 ? (
            <>
              <VStack>
                <MetadataForm value={metadataForm} />
                <GenerateOrUpload generationStatus={generationStatus} generateCallback={() => confirmGenerateDialog.setOpen(true)} uploadCallback={() => confirmUploadDialog.setOpen(true)} />
              </VStack>
              <ConfirmUploadDialog dialog={confirmUploadDialog} confirmCallback={uploadFiles} />
              <ConfirmGenerateDialog dialog={confirmGenerateDialog} confirmCallback={generateMetadata} />
            </>
          ) : (
            <></>
          )}
        </VStack>
      </Box>
    </UploadTrayContext.Provider>
  );
}
