"use client";

import { Box, Button, Icon, LinkOverlay, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadButton() {
  const router = useRouter();

  return (
    <Link href={"/upload"}>
      <Button variant={"outline"}>
        <Icon>
          <Box className={"material-symbols-outlined"}>upload</Box>
        </Icon>
        <Text userSelect={"none"}>Upload</Text>
      </Button>
    </Link>
  );
}
