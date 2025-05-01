"use client";

import { Box, FileUpload, Flex, Float, Icon, useFileUpload, VStack } from "@chakra-ui/react";

export default function Dropzone(props: { fileUpload: ReturnType<typeof useFileUpload> }) {
  return (
    <FileUpload.RootProvider value={props.fileUpload} maxW="xl" alignItems="stretch">
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <FileUpload.DropzoneContent>
          {props.fileUpload.acceptedFiles.length == 0 ? (
            <>
              <Icon size="md" color="fg.muted">
                <Box className={"material-symbols-outlined"}>upload</Box>
              </Icon>
              <Box>Drag and drop files here</Box>
              <Box color="fg.muted">.pdf up to 100 MB per file</Box>
            </>
          ) : (
            <Flex justifyContent={"flex-start"} gap={4} width={"full"} height={"full"} wrap={"wrap"}>
              {props.fileUpload.acceptedFiles.map((file) => (
                <FileUpload.Item key={file.name} file={file} aspectRatio={"square"} w={"24"} h={"24"} onClick={(e) => e.stopPropagation()}>
                  <VStack justify={"center"}>
                    <FileUpload.ItemPreview />
                    <FileUpload.ItemName />
                  </VStack>

                  <Float placement="top-end">
                    <FileUpload.ItemDeleteTrigger>
                      <Box className={"material-symbols-outlined"}>close</Box>
                    </FileUpload.ItemDeleteTrigger>
                  </Float>
                </FileUpload.Item>
              ))}
            </Flex>
          )}
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </FileUpload.RootProvider>
  );
}
