import { Flex } from "@chakra-ui/react";
import UploadTray from "@/components/upload/upload-tray";

export default function UploadPage() {
  return (
    <Flex width={"full"} h={"full"} alignItems={"center"} justifyContent={"center"} direction={"column"} gap={"4"}>
      <UploadTray />
    </Flex>
  );
}
