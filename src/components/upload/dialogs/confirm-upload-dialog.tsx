import { Box, Dialog, FileUpload, UseDialogReturn } from "@chakra-ui/react";
import ConfirmDialog from "@/components/confirm-dialog";
import { useContext } from "react";
import { UploadTrayContext } from "@/components/upload/upload-tray";

export function ConfirmUploadDialog(props: { dialog: UseDialogReturn; confirmCallback: () => void }) {
  const { dialog, confirmCallback } = props;

  const uploadTrayContext = useContext(UploadTrayContext);

  if (!uploadTrayContext?.fileUploadTray) {
    throw new Error("FileUpload context is not available, perhaps you forgot to wrap the component with UploadTrayContext.Provider?");
  }

  return (
    <ConfirmDialog value={dialog} confirmCallback={confirmCallback}>
      <Dialog.Header>
        <Dialog.Title>Are you sure you want to upload these files?</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <FileUpload.RootProvider value={uploadTrayContext.fileUploadTray}>
          <Box overflowY={"scroll"} maxHeight={"lg"}>
            <FileUpload.Context>
              {(context) =>
                context.acceptedFiles.map((file) => (
                  <FileUpload.Item key={file.name} file={file}>
                    <FileUpload.ItemPreview />
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <FileUpload.ItemDeleteTrigger />
                  </FileUpload.Item>
                ))
              }
            </FileUpload.Context>
          </Box>
        </FileUpload.RootProvider>
      </Dialog.Body>
    </ConfirmDialog>
  );
}
