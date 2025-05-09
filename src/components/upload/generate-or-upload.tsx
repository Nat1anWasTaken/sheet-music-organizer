import { GenerationStatus } from "@/hooks/use-metadata-generator";
import { Button, HStack } from "@chakra-ui/react";
import { useMemo } from "react";

interface GenerateOrUploadProps {
  generationStatus: GenerationStatus;
  generateCallback?: () => void;
  uploadCallback?: () => void;
}

export function GenerateOrUpload(props: GenerateOrUploadProps) {
  const { generationStatus, generateCallback, uploadCallback } = props;

  const generationStatusText = useMemo(() => {
    return {
      idle: "Generate Metadata with AI",
      merging_file: "Merging files...",
      uploading: "Uploading...",
      waiting_for_response: "Waiting for response..."
    }[generationStatus];
  }, [generationStatus]);

  const isGenerating = useMemo(() => ["merging_file", "uploading", "waiting_for_response"].includes(generationStatus), [generationStatus]);

  return (
    <HStack gap={"2"} justify={"flex-end"}>
      <Button variant={"subtle"} loading={isGenerating} loadingText={generationStatusText} onClick={generateCallback}>
        {generationStatusText}
      </Button>
      <Button onClick={uploadCallback}>Upload</Button>
    </HStack>
  );
}
