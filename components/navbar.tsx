"use client";

import { Avatar, Box, Button, Flex, HStack, Icon, Link, Menu, Portal, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowDropdown } from "react-icons/io";

const tabs = [
  { name: "Home", href: "/" },
  { name: "Library", href: "/library" },
  { name: "Settings", href: "/settings" },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me");

      if (res.ok) {
        setUser(await res.json());
      }
    }

    fetchUser();
  });

  return (
    <Box bg={"bg.subtle"} px={4} boxShadow={"sm"} position={"sticky"} top={0} zIndex={999}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* Left Part */}

        {/* Right Part */}
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
      </Flex>
    </Box>
  );
}
