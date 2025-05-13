"use client";
import { ConfirmGenerateDialog } from "@/components/upload/dialogs/confirm-generate-dialog";
import { ConfirmUploadDialog } from "@/components/upload/dialogs/confirm-upload-dialog";
import Dropzone from "@/components/upload/dropzone";
import { GenerateOrUpload } from "@/components/upload/generate-or-upload";
import MetadataForm from "@/components/upload/metadata-form";
import { useMetadataForm, UseMetadataFormReturn } from "@/hooks/upload/use-metadata-form";
import { useMetadataGenerator } from "@/hooks/upload/use-metadata-generator";
import { useUploadArrangement } from "@/hooks/upload/use-upload-arrangement";
import { Box, useDialog, useFileUpload, UseFileUploadReturn, VStack } from "@chakra-ui/react";
import { createContext } from "react";
import { toaster } from "@/components/ui/toaster";

interface UploadTrayContext {
  fileUploadTray: UseFileUploadReturn;
  metadataForm: UseMetadataFormReturn;
}

export const UploadTrayContext = createContext<UploadTrayContext | null>(null);

export default function UploadTray() {
  const fileUploadTray = useFileUpload({
    maxFiles: 20,
    maxFileSize: 100 * 1024 * 1024,
    accept: "application/pdf"
  });

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

  const confirmGenerateDialog = useDialog();
  const confirmUploadDialog = useDialog();

  const { uploadStatus, createArrangementAndUploadFiles } = useUploadArrangement(fileUploadTray, metadataForm);

  return (
    <UploadTrayContext.Provider value={{ fileUploadTray, metadataForm }}>
      <Box width={{ base: "full", md: "xl" }} border={"solid"} borderWidth={"1px"} borderColor={"border"} p={4} rounded={"md"}>
        <VStack gap={4}>
          <Dropzone fileUpload={fileUploadTray} />

          {fileUploadTray.acceptedFiles.length > 0 ? (
            <>
              <VStack>
                <MetadataForm value={metadataForm} />
                <GenerateOrUpload
                  generationStatus={generationStatus}
                  generateCallback={() => confirmGenerateDialog.setOpen(true)}
                  uploadStatus={uploadStatus}
                  uploadCallback={() => confirmUploadDialog.setOpen(true)}
                />
              </VStack>
              <ConfirmUploadDialog
                dialog={confirmUploadDialog}
                confirmCallback={() => {
                  createArrangementAndUploadFiles().catch((e) => {
                    toaster.create({
                      type: "error",
                      description: e.message
                    });
                  });
                }}
              />
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
