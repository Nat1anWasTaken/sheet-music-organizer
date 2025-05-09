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
      [GenerationStatus.Idle]: "Generate Metadata with AI",
      [GenerationStatus.MergingFile]: "Merging files...",
      [GenerationStatus.Uploading]: "Uploading...",
      [GenerationStatus.WaitingForResponse]: "Waiting for response..."
    }[generationStatus];
  }, [generationStatus]);

  const isGenerating = useMemo(() => [
    GenerationStatus.MergingFile,
    GenerationStatus.Uploading,
    GenerationStatus.WaitingForResponse
  ].includes(generationStatus), [generationStatus]);

  return (
    <HStack gap={"2"} justify={"flex-end"}>
      <Button variant={"subtle"} loading={isGenerating} loadingText={generationStatusText} onClick={generateCallback}>
        {generationStatusText}
      </Button>
      <Button onClick={uploadCallback}>Upload</Button>
    </HStack>
  );
}
