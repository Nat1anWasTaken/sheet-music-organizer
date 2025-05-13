"use client";

import { Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import MaterialIcon from "../ui/material-icon";

export default function UploadButton() {
  return (
    <Link href={"/upload"}>
      <Button variant={"outline"}>
        <MaterialIcon icon={"upload"} />
        <Text userSelect={"none"}>Upload</Text>
      </Button>
    </Link>
  );
}
