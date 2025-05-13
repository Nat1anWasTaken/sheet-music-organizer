import AvatarOrLogin from "@/components/navbar/avatar-or-login";
import { MobileNavigationDrawer } from "@/components/navbar/mobile-navigation-drawer";
import { NavigationTabs } from "@/components/navbar/navigation-tabs";
import UploadButton from "@/components/navbar/upload-button";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Flex, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";

export type Tab = { name: string; href: string };

export const tabs: Tab[] = [
  { name: "Home", href: "/" },
  { name: "Library", href: "/library" },
  { name: "Settings", href: "/settings" }
];

export default function Navbar() {
  return (
    <Box bg={"bg.subtle"} px={4} boxShadow={"sm"} position={"sticky"} top={0} zIndex={999}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* Left Part */}
        <HStack gap={4} alignItems={"center"} display={{ base: "inline", md: "none" }}>
          <MobileNavigationDrawer tabs={tabs} />
          {/* TODO: Logo */}
        </HStack>
        <HStack gap={4} display={{ base: "none", md: "flex" }}>
          <Heading as={"h1"} size={"lg"} display={{ base: "none", md: "inline" }} color={"fg"}>
            <Link href={"/"}>Sheet Music Organizer</Link>
          </Heading>
          
          <NavigationTabs tabs={tabs} />
        </HStack>

        {/* Right Part */}
        <HStack gap={4}>
          <UploadButton />
          <ColorModeButton />
          <AvatarOrLogin />
        </HStack>
      </Flex>
    </Box>
  );
}
