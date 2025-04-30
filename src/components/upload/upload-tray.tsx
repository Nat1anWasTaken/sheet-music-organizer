"use client";
import { Box, Button, Field, Fieldset, HStack, Input, useFileUpload, VStack } from "@chakra-ui/react";
import Dropzone from "@/components/upload/dropzone";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

export default function UploadTray() {
  const fileUpload = useFileUpload({
    maxFiles: 20,
    maxFileSize: 5 * 1024 * 1024,
    accept: "application/pdf",
  });

  const [title, setTitle] = useState("");
  const [composers, setComposers] = useState("");
  const [arrangementType, setArrangementType] = useState("");

  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (fileUpload.acceptedFiles.length === 0) {
      toaster.create({ type: "warning", description: "Select at least one file to generate metadata." });
      return;
    }

    const form = new FormData();
    fileUpload.acceptedFiles.forEach((file) => {
      form.append("files", file, file.name);
    });

    try {
      const res = await fetch("/api/generate-metadata", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { title: string; composers: string[]; arrangement_type: string } = await res.json();
      console.log(data);

      setTitle(data.title);
      setComposers(data.composers.join(", "));
      setArrangementType(data.arrangement_type);

      toaster.create({ type: "success", description: "Metadata generated successfully." });
    } catch (err) {
      console.error(err);
      toaster.create({ type: "error", description: "Something is wrong, try again later." });
    }
  };

  return (
    <Box width={{ base: "full", md: "xl" }} border={"solid"} borderWidth={"1px"} borderColor={"border"} p={4} rounded={"md"}>
      <VStack gap={4}>
        <Dropzone fileUpload={fileUpload} />

        {fileUpload.acceptedFiles.length > 0 ? (
          <Fieldset.Root>
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Arrangement Title</Field.Label>
                <Input name={"title"} value={title} onChange={(e) => setTitle(e.target.value)}></Input>
              </Field.Root>

              <Field.Root>
                <Field.Label>Composers and Arrangers</Field.Label>
                <Field.HelperText>Separate different authors with commas, like this &quot;John, Nathan,...&quot;</Field.HelperText>
                <Input name={"composers"} value={composers} onChange={(e) => setComposers(e.target.value)}></Input>
              </Field.Root>

              <Field.Root>
                <Field.Label>Arrangement Type</Field.Label>
                <Field.HelperText>Like Concert Band, Percussion Ensemble, etc...</Field.HelperText>
                <Input
                  name={"arrangement_type"}
                  value={arrangementType}
                  onChange={(e) => {
                    setArrangementType(e.target.value);
                  }}
                ></Input>
              </Field.Root>
            </Fieldset.Content>

            <HStack gap={"4"} justify={"flex-end"}>
              <Button
                variant={"subtle"}
                loading={generating}
                loadingText={"Generating..."}
                onClick={async () => {
                  setGenerating(true);
                  await handleGenerate();
                  setGenerating(false);
                }}
              >
                Generate
              </Button>
              <Button>Upload</Button>
            </HStack>
          </Fieldset.Root>
        ) : (
          <></>
        )}
      </VStack>
    </Box>
  );
}
