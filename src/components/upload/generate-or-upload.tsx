import { GenerationStatus } from "@/hooks/upload/use-metadata-generator";
import { UploadStatus } from "@/hooks/upload/use-upload-arrangement";
import { Button, HStack } from "@chakra-ui/react";
import { useMemo } from "react";

interface GenerateOrUploadProps {
  generationStatus: GenerationStatus;
  generateCallback?: () => void;
  uploadStatus: UploadStatus;
  uploadCallback?: () => void;
}

export function GenerateOrUpload(props: GenerateOrUploadProps) {
  const { generationStatus, generateCallback, uploadStatus, uploadCallback } = props;

  const generationStatusText = useMemo(() => {
    return {
      [GenerationStatus.Idle]: "Generate Metadata with AI",
      [GenerationStatus.MergingFile]: "Merging files...",
      [GenerationStatus.Uploading]: "Uploading...",
      [GenerationStatus.WaitingForResponse]: "Waiting for response..."
    }[generationStatus];
  }, [generationStatus]);

  const isGenerating = useMemo(() => [GenerationStatus.MergingFile, GenerationStatus.Uploading, GenerationStatus.WaitingForResponse].includes(generationStatus), [generationStatus]);

  const uploadStatusText = useMemo(() => {
    return {
      [UploadStatus.Idle]: "Upload",
      [UploadStatus.CreatingArrangement]: "Creating arrangement...",
      [UploadStatus.UploadingParts]: "Uploading..."
    }[uploadStatus];
  }, [uploadStatus]);

  const isUploading = useMemo(() => [UploadStatus.CreatingArrangement, UploadStatus.UploadingParts].includes(uploadStatus), [uploadStatus]);

  return (
    <HStack gap={"2"} justify={"flex-end"}>
      <Button variant={"subtle"} loading={isGenerating} loadingText={generationStatusText} onClick={generateCallback}>
        {generationStatusText}
      </Button>
      <Button loading={isUploading} loadingText={uploadStatusText} onClick={uploadCallback}>
        Upload
      </Button>
    </HStack>
  );
}
