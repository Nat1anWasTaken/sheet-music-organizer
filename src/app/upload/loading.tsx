import { Box, Flex, Icon, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export default function LoadingUploadPage() {
  return (
    <Flex padding={"4"} width={"full"} h={"full"} alignItems={"center"} justifyContent={"center"} direction={"column"} gap={"4"} overflowY={"auto"}>
      <Box width={{ base: "full", md: "xl" }} border={"solid"} borderWidth={"1px"} borderColor={"border"} p={4} rounded={"md"}>
        <Box minH={"2xs"} maxW={"xl"}>
          <Skeleton />
        </Box>
      </Box>
    </Flex>
  );
}
