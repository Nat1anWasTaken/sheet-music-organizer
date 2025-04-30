"use client";

import { Box, Button, Icon, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function UploadButton() {
  const router = useRouter();

  return (
    <Button
      variant={"outline"}
      onClick={() => {
        router.push("/upload");
      }}
    >
      <Icon>
        <Box className={"material-symbols-outlined"}>upload</Box>
      </Icon>
      <Text userSelect={"none"}>Upload</Text>
    </Button>
  );
}
