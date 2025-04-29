import SheetMusic from "@/components/sheet-music";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center width={"full"} p={5}>
      <Box width={"full"} maxWidth={"container.lg"} mx={"auto"}>
        <Heading>Featured</Heading>
        <Flex gap={"4"} wrap={"wrap"}>
          {Array.from({ length: 20 }, (_, index) => (
            <SheetMusic
              key={index}
              preview_img_url={"https://i0.wp.com/www.mypianomusicsheets.com/wp-content/uploads/2022/07/HAPPY-BIRTHDAY_piano_super-easy.jpg?fit=793%2C1123&ssl=1"}
              title={"Sheet Name"}
              description="Aliqua sit id voluptate enim incididunt esse velit incididunt aliqua pariatur."
            />
          ))}
        </Flex>
      </Box>
    </Center>
  );
}
