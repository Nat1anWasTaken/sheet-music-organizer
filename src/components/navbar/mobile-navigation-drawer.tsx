"use client";

import { Box, CloseButton, Drawer, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { tabs } from "@/components/navbar/navbar";

export function MobileNavigationDrawer(props: { tabs: typeof tabs }) {
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
