"use client";

import { Button, Field, Fieldset, HStack, Input } from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface MetadataFormProps {
  title: string;
  composers: string;
  arrangementType: string;
  generating: boolean;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onComposersChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onArrangementTypeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGenerateClick: () => void;
  onUploadClick: () => void;
}

export default function MetadataForm({ title, composers, arrangementType, generating, onTitleChange, onComposersChange, onArrangementTypeChange, onGenerateClick, onUploadClick }: MetadataFormProps) {
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
        <Button variant={"subtle"} loading={generating} loadingText={"Generating..."} onClick={onGenerateClick}>
          Generate
        </Button>
        <Button onClick={onUploadClick}>Upload</Button>
      </HStack>
    </Fieldset.Root>
  );
}
