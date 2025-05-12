"use client";

import { Box, FileUpload, Flex, Icon, useFileUpload } from "@chakra-ui/react";
import FileItem from "./file-item";

export default function Dropzone(props: { fileUpload: ReturnType<typeof useFileUpload> }) {
  return (
    <FileUpload.RootProvider value={props.fileUpload} maxW="xl" alignItems="stretch">
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <FileUpload.DropzoneContent>
          {props.fileUpload.acceptedFiles.length + props.fileUpload.rejectedFiles.length <= 0 ? (
            <Flex justifyContent={"flex-start"} gap={4} width={"full"} height={"full"} wrap={"wrap"}>
              {props.fileUpload.acceptedFiles.map((file, index) => (
                <FileItem key={index} file={file} accepted={true} />
              ))}
              {props.fileUpload.rejectedFiles.map((file, index) => (
                <FileItem key={index} file={file.file} accepted={false} />
              ))}
            </Flex>
          ) : (
            <>
              <Icon size="md" color="fg.muted">
                <Box className={"material-symbols-outlined"}>upload</Box>
              </Icon>
              <Box>Drag and drop files here</Box>
              <Box color="fg.muted">.pdf up to 100 MB per file</Box>
            </>
          )}
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </FileUpload.RootProvider>
  );
}
