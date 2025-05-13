"use client";

import { Avatar, Box, Button, Icon, Link, Menu, Portal, Text } from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import MaterialIcon from "../ui/material-icon";

export default function AvatarOrLogin() {
  const { user } = useUser();
  const router = useRouter();

  return user ? (
    <Menu.Root>
      <Menu.Trigger>
        <Avatar.Root>
          <Avatar.Image src={user.picture} alt={user.name} />
          <Avatar.Fallback name={user.name} />
        </Avatar.Root>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item disabled value={"user_id"}>
              <Text color={"fg.subtle"}>User ID: {user.sub}</Text>
            </Menu.Item>
            <Menu.Item asChild value={"logout"}>
              <Link href={"/auth/logout"}>Logout</Link>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  ) : (
    <Button variant={"outline"} onClick={() => router.push("/auth/login")}>
      <Icon>
        <MaterialIcon icon={"account_circle"} />
      </Icon>
      <Text userSelect={"none"}>Login</Text>
    </Button>
  );
}
