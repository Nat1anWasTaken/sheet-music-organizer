"use client";
import { ConfirmGenerateDialog } from "@/components/upload/dialogs/confirm-generate-dialog";
import { ConfirmUploadDialog } from "@/components/upload/dialogs/confirm-upload-dialog";
import Dropzone from "@/components/upload/dropzone";
import { GenerateOrUpload } from "@/components/upload/generate-or-upload";
import MetadataForm from "@/components/upload/metadata-form";
import { useMetadataForm } from "@/hooks/use-metadata-form";
import { useMetadataGenerator } from "@/hooks/use-metadata-generator";
import { Box, useDialog, useFileUpload, UseFileUploadReturn, VStack } from "@chakra-ui/react";
import { createContext } from "react";
import { toaster } from "../ui/toaster";

export const UploadTrayContext = createContext<UseFileUploadReturn | null>(null);

export default function UploadTray() {
  const fileUploadTray = useFileUpload({
    maxFiles: 20,
    maxFileSize: 100 * 1024 * 1024,
    accept: "application/pdf"
  });

  const confirmGenerateDialog = useDialog();
  const confirmUploadDialog = useDialog();

  const metadataForm = useMetadataForm();

  const { generationStatus, generateMetadata } = useMetadataGenerator({
    files: fileUploadTray.acceptedFiles,
    onSuccess: (data) => {
      metadataForm.setFormContent({
        title: data.title,
        composers: data.composers.join(", "),
        arrangementType: data.arrangement_type
      });
    },
    fileSplitCallback: (newFiles) => {
      fileUploadTray.acceptedFiles.splice(0, fileUploadTray.acceptedFiles.length, ...newFiles);
    }
  });

  const uploadFiles = () => {
    fetch("/api/arrangements", {
      method: "POST",
      headers: {},
      body: JSON.stringify({
        visibility: "public", // TODO: make this dynamic
        title: metadataForm.formContent.title,
        composers: metadataForm.formContent.composers.split(",").map((c) => c.trim()),
        arrangementType: metadataForm.formContent.arrangementType
      })
    }).then((response) => {
      if (response.ok) {
        toaster.create({
          type: "success",
          description: "Files uploaded successfully"
        });
      }
    });
  };

  return (
    <UploadTrayContext.Provider value={fileUploadTray}>
      <Box width={{ base: "full", md: "xl" }} border={"solid"} borderWidth={"1px"} borderColor={"border"} p={4} rounded={"md"}>
        <VStack gap={4}>
          <Dropzone fileUpload={fileUploadTray} />

          {fileUploadTray.acceptedFiles.length > 0 ? (
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
