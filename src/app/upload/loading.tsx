import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

export default function LoadingUploadPage() {
  return (
    <Flex padding={"4"} width={"full"} h={"full"} alignItems={"center"} justifyContent={"center"} direction={"column"} gap={"4"} overflowY={"auto"}>
      <Box width={{ base: "full", md: "xl" }} border={"solid"} borderWidth={"1px"} borderColor={"border"} p={4} rounded={"md"}>
        <Flex minH={"2xs"} maxW={"xl"} justifyContent={"center"} alignItems={"center"} direction={"row"} gap={4}>
          <Spinner size={"lg"} />
          <Text>Loading...</Text>
        </Flex>
      </Box>
    </Flex>
  );
}
