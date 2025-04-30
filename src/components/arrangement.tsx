import { Box, Heading, Image, Text } from "@chakra-ui/react";

export default async function Arrangement(props: { preview_img_url: string; title: string; description: string }) {
  return (
    <Box maxW={{ base: "80vw", md: "198px" }}>
      <Image
        src={"https://i0.wp.com/www.mypianomusicsheets.com/wp-content/uploads/2022/07/HAPPY-BIRTHDAY_piano_super-easy.jpg?fit=793%2C1123&ssl=1"}
        alt={"placeholder for image"}
        aspectRatio={3 / 4}
        border={"solid"}
        borderWidth={"1px"}
        borderColor={"border"}
      />
      <Box width={"100%"} padding={"5px"}>
        <Heading size={"md"}>{props.title}</Heading>
        <Text textStyle={"xs"} color={"fg.muted"}>
          {props.description}
        </Text>
      </Box>
    </Box>
  );
}
