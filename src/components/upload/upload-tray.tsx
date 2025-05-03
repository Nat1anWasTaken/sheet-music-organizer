"use client";
import { Box, Dialog, FileUpload, useDialog, useFileUpload, VStack } from "@chakra-ui/react";
import Dropzone from "@/components/upload/dropzone";
import { useState } from "react";
import ConfirmDialog from "@/components/confirm-dialog";
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
  const confirmUploadDialog = useDialog();

  const { generationStatus, generateMetadata } = useMetadataGenerator({
    files: fileUpload.acceptedFiles,
    onSuccess: (data) => {
      setTitle(data.title);
      setComposers(data.composers.join(", "));
      setArrangementType(data.arrangement_type);
    },
    onFilesUpdate: (newFiles) => {
      fileUpload.acceptedFiles.splice(0, fileUpload.acceptedFiles.length, ...newFiles);
    },
  });

  const uploadFiles = () => {};

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
              onUploadClick={() => confirmUploadDialog.setOpen(true)}
            />
            <ConfirmDialog value={confirmMergeDialog} confirmCallback={generateMetadata}>
              <Dialog.Header>
                <Dialog.Title>Are you sure?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Description>This will merge all your files into one file and generate metadata for you.</Dialog.Description>
              </Dialog.Body>
            </ConfirmDialog>
            <ConfirmDialog value={confirmUploadDialog} confirmCallback={uploadFiles}>
              <Dialog.Header>
                <Dialog.Title>Are you sure you want to upload these files?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <FileUpload.RootProvider value={fileUpload}>
                  <Box overflowY={"scroll"} maxHeight={"lg"}>
                    <FileUpload.Context>
                      {(context) =>
                        context.acceptedFiles.map((file) => (
                          <FileUpload.Item key={file.name} file={file}>
                            <FileUpload.ItemPreview />
                            <FileUpload.ItemName />
                            <FileUpload.ItemSizeText />
                            <FileUpload.ItemDeleteTrigger />
                          </FileUpload.Item>
                        ))
                      }
                    </FileUpload.Context>
                  </Box>
                </FileUpload.RootProvider>
              </Dialog.Body>
            </ConfirmDialog>
          </>
        ) : (
          <></>
        )}
      </VStack>
    </Box>
  );
}
