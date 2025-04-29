"use client";

import { Box, CloseButton, Drawer, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ColorModeButton } from "@/components/ui/color-mode";
import AvatarOrLogin from "@/components/avatar-or-login";

const tabs = [
  { name: "Home", href: "/" },
  { name: "Library", href: "/library" },
  { name: "Settings", href: "/settings" },
];

// 正確接收 props
function MobileNavigationDrawer(props: { tabs: typeof tabs }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <Drawer.Backdrop />
      <Drawer.Trigger>
        <Box className={"material-symbols-outlined"}>menu</Box>
      </Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Navigation</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <VStack gap={"4"} align={"start"}>
              {props.tabs.map((tab) => (
                <Text
                  key={tab.href}
                  onClick={() => {
                    router.push(tab.href);
                    setIsOpen(false);
                  }}
                  color={tab.href === pathname ? "fg" : "fg.subtle"}
                  _active={{ color: "fg" }}
                >
                  {tab.name}
                </Text>
              ))}
            </VStack>
          </Drawer.Body>
          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  return (
    <Box bg={"bg.subtle"} px={4} boxShadow={"sm"} position={"sticky"} top={0} zIndex={999}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* Left Part */}
        <HStack gap={4} alignItems={"center"} display={{ base: "inline", md: "none" }}>
          <MobileNavigationDrawer tabs={tabs} />
          {/* TODO: Logo */}
        </HStack>
        <Heading as={"h1"} size={"lg"} display={{ base: "none", md: "inline" }}>
          Sheet Music Organizer
        </Heading>

        {/* Right Part */}
        <HStack gap={4}>
          <ColorModeButton />
          <AvatarOrLogin />
        </HStack>
      </Flex>
    </Box>
  );
}
