"use client";

import { Field, Fieldset, Input } from "@chakra-ui/react";
import { UseMetadataFormReturn } from "@/hooks/upload/use-metadata-form";

interface MetadataFormProps {
  value: UseMetadataFormReturn;
}

export default function MetadataForm(props: MetadataFormProps) {
  const { formContent, setFormContent, handleInputChange } = props.value;

  return (
    <Fieldset.Root>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Arrangement Title</Field.Label>
          <Input name={"title"} value={formContent.title} onChange={handleInputChange("title")}></Input>
        </Field.Root>

        <Field.Root>
          <Field.Label>Composers and Arrangers</Field.Label>
          <Field.HelperText>Separate different authors with commas, like this &quot;John, Nathan,...&quot;</Field.HelperText>
          <Input name={"composers"} value={formContent.composers} onChange={handleInputChange("composers")}></Input>
        </Field.Root>

        <Field.Root>
          <Field.Label>Arrangement Type</Field.Label>
          <Field.HelperText>Like Concert Band, Percussion Ensemble, etc...</Field.HelperText>
          <Input name={"arrangement_type"} value={formContent.arrangementType} onChange={handleInputChange("arrangementType")}></Input>
        </Field.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}
