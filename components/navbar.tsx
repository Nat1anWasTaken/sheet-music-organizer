"use client";

import { Avatar, Box, Button, CloseButton, Drawer, Flex, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ColorModeButton } from "@/components/ui/color-mode";

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
  const { user, setUser } = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me");

      if (res.ok) {
        setUser(await res.json());
      }
    }

    fetchUser();
  }, []); // 添加空依賴數組，避免無限循環

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

          {/* Avatar or Login */}
          {user ? (
            <Avatar.Root>
              <Avatar.Image src="https://avatars.githubusercontent.com/u/56459446?v=4" />
              <Avatar.Fallback name="Nathan" />
            </Avatar.Root>
          ) : (
            <Button variant={"outline"} onClick={() => router.push("/login")}>
              <Icon>
                <Box className={"material-symbols-outlined"}>account_circle</Box>
              </Icon>
              <Text userSelect={"none"}>Login</Text>
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
