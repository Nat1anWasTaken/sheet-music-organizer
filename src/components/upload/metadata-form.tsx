"use client";

import { Button, Field, Fieldset, HStack, Input } from "@chakra-ui/react";
import { ChangeEvent, useMemo } from "react";
import { GenerationStatus } from "@/hooks/use-metadata-generator";

interface MetadataFormProps {
  title: string;
  composers: string;
  arrangementType: string;
  generationStatus: GenerationStatus;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onComposersChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onArrangementTypeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGenerateClick: () => void;
  onUploadClick: () => void;
}

export default function MetadataForm({
  title,
  composers,
  arrangementType,
  generationStatus,
  onTitleChange,
  onComposersChange,
  onArrangementTypeChange,
  onGenerateClick,
  onUploadClick,
}: MetadataFormProps) {
  const { isGenerating, generationStatusText } = useMemo(
    () => ({
      isGenerating: ["merging_file", "uploading", "waiting_for_response"].includes(generationStatus),
      generationStatusText: {
        idle: "Generate Metadata with AI",
        merging_file: "Merging files...",
        uploading: "Uploading...",
        waiting_for_response: "Waiting for response...",
      }[generationStatus],
    }),
    [generationStatus],
  );

  return (
    <Fieldset.Root>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Arrangement Title</Field.Label>
          <Input name={"title"} value={title} onChange={onTitleChange}></Input>
        </Field.Root>

        <Field.Root>
          <Field.Label>Composers and Arrangers</Field.Label>
          <Field.HelperText>Separate different authors with commas, like this &quot;John, Nathan,...&quot;</Field.HelperText>
          <Input name={"composers"} value={composers} onChange={onComposersChange}></Input>
        </Field.Root>

        <Field.Root>
          <Field.Label>Arrangement Type</Field.Label>
          <Field.HelperText>Like Concert Band, Percussion Ensemble, etc...</Field.HelperText>
          <Input name={"arrangement_type"} value={arrangementType} onChange={onArrangementTypeChange}></Input>
        </Field.Root>
      </Fieldset.Content>

      <HStack gap={"4"} justify={"flex-end"}>
        <Button variant={"subtle"} loading={isGenerating} loadingText={generationStatusText} onClick={onGenerateClick}>
          {generationStatusText}
        </Button>
        <Button onClick={onUploadClick}>Upload</Button>
      </HStack>
    </Fieldset.Root>
  );
}
