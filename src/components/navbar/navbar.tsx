import { Box, Flex, Heading, HStack } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import AvatarOrLogin from "@/components/navbar/avatar-or-login";
import { NavigationTabs } from "@/components/navbar/navigation-tabs";
import { MobileNavigationDrawer } from "@/components/navbar/mobile-navigation-drawer";

export type Tab = { name: string; href: string };

export const tabs: Tab[] = [
  { name: "Home", href: "/" },
  { name: "Library", href: "/library" },
  { name: "Settings", href: "/settings" },
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
            Sheet Music Organizer
          </Heading>
          <NavigationTabs tabs={tabs} />
        </HStack>

        {/* Right Part */}
        <HStack gap={4}>
          <ColorModeButton />
          <AvatarOrLogin />
        </HStack>
      </Flex>
    </Box>
  );
}
