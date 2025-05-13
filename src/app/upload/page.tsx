"use client";

import UploadTray from "@/components/upload/upload-tray";
import { useUser } from "@auth0/nextjs-auth0";
import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (!user && !isLoading) {
    // Redirect to login page
    router.push("/auth/login");
  }

  if (isLoading) {
    throw new Promise(() => {});
  }

  return (
    <Flex padding={"4"} width={"full"} h={"full"} alignItems={"center"} justifyContent={"center"} direction={"column"} gap={"4"} overflowY={"auto"}>
      <UploadTray />
    </Flex>
  );
}
