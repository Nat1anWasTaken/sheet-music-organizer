"use client";

import { Box, FileUpload, Float, VStack } from "@chakra-ui/react";
import { downloadFile } from "@/lib/utils";

export default function FileItem(props: { file: File; accepted: boolean }) {
  const { file, accepted } = props;

  return (
    <FileUpload.Item key={file.name} file={file} aspectRatio={"square"} w={"24"} h={"24"} bgColor={accepted ? "bg" : "bg.error"} onClick={(e) => e.stopPropagation()}>
      <VStack justify={"center"}>
        <FileUpload.ItemPreview />
        <FileUpload.ItemName />
      </VStack>

      <Float placement="top-end">
        <FileUpload.ItemDeleteTrigger>
          <Box className={"material-symbols-outlined"}>close</Box>
        </FileUpload.ItemDeleteTrigger>
      </Float>

      <Float placement="bottom-end">
        <Box
          className={"material-symbols-outlined"}
          onClick={() => {
            downloadFile(file);
          }}
          cursor={"pointer"}
        >
          download
        </Box>
      </Float>
    </FileUpload.Item>
  );
}
