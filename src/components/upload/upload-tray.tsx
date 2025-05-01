"use client";
import { Box, Button, Field, Fieldset, HStack, Input, useDialog, useFileUpload, VStack } from "@chakra-ui/react";
import Dropzone from "@/components/upload/dropzone";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { PDFDocument } from "pdf-lib";
import ConfirmMergeDialog from "@/components/upload/confirm-merge-dialog";
import { PartInformation } from "@/app/api/generate-metadata/route";

async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const src = await PDFDocument.load(arrayBuffer);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return merged.save();
}

export async function splitPdfByParts(mergedPdfBytes: Uint8Array | ArrayBuffer, parts: PartInformation[]): Promise<File[]> {
  const srcDoc = await PDFDocument.load(mergedPdfBytes);

  return Promise.all(
    parts.map(async (part) => {
      const doc = await PDFDocument.create();

      // Pages are zero-indexed internally
      const pageCount = part.end_page - part.start_page + 1;
      const pageIndices = Array.from({ length: pageCount }, (_, i) => part.start_page - 1 + i);

      const copiedPages = await doc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((p) => doc.addPage(p));

      const bytes = await doc.save();
      return new File([bytes], `${part.label}.pdf`, {
        type: "application/pdf",
      });
    }),
  );
}

export default function UploadTray() {
  const fileUpload = useFileUpload({
    maxFiles: 20,
    maxFileSize: 100 * 1024 * 1024,
    accept: "application/pdf",
  });

  const [title, setTitle] = useState("");
  const [composers, setComposers] = useState("");
  const [arrangementType, setArrangementType] = useState("");

  const [generating, setGenerating] = useState(false);

  const confirmMergeDialog = useDialog();

  const handleGenerate = async () => {
    if (fileUpload.acceptedFiles.length === 0) {
      toaster.create({ type: "warning", description: "Select at least one file to generate metadata." });
      return;
    }

    try {
      const mergedPdfBytes = await mergePDFs(fileUpload.acceptedFiles);

      const mergedFile = new File([mergedPdfBytes], "merged.pdf", { type: "application/pdf" });

      const form = new FormData();
      form.append("files", mergedFile);

      const res = await fetch("/api/generate-metadata", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        toaster.create({ type: "error", description: JSON.stringify(await res.json()) });
        throw new Error(`HTTP ${res.status}`);
      }
      const data: {
        title: string;
        composers: string[];
        arrangement_type: string;
        parts: PartInformation[];
      } = await res.json();
      console.log(data);

      setTitle(data.title);
      setComposers(data.composers.join(", "));
      setArrangementType(data.arrangement_type);

      fileUpload.acceptedFiles.splice(0, fileUpload.acceptedFiles.length, ...(await splitPdfByParts(mergedPdfBytes, data.parts)));

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
          <>
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
                  onClick={() => {
                    confirmMergeDialog.setOpen(true);
                  }}
                >
                  Generate
                </Button>
                <Button>Upload</Button>
              </HStack>
            </Fieldset.Root>
            <ConfirmMergeDialog
              value={confirmMergeDialog}
              confirmCallback={async () => {
                setGenerating(true);
                await handleGenerate();
                setGenerating(false);
              }}
            />
          </>
        ) : (
          <></>
        )}
      </VStack>
    </Box>
  );
}
