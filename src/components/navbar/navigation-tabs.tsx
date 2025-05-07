"use client";

import { Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { Tab } from "@/components/navbar/navbar";
import Link from "next/link";

export function NavigationTabs(props: { tabs: Tab[] }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {props.tabs.map((tab) => (
        <Link href={tab.href} key={tab.href}>
          <Text color={tab.href === pathname ? "fg" : "fg.subtle"} cursor={"pointer"} _hover={{ color: "fg" }}>
            {tab.name}
          </Text>
        </Link>
      ))}
    </>
  );
}
