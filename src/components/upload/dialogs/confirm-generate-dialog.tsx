import { Dialog, UseDialogReturn } from "@chakra-ui/react";
import ConfirmDialog from "@/components/confirm-dialog";

export function ConfirmGenerateDialog(props: { dialog: UseDialogReturn; confirmCallback: () => void }) {
  const { dialog, confirmCallback } = props;

  return (
    <ConfirmDialog value={dialog} confirmCallback={confirmCallback}>
      <Dialog.Header>
        <Dialog.Title>Are you sure?</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>This will merge all your files into one file and generate metadata for you.</Dialog.Description>
      </Dialog.Body>
    </ConfirmDialog>
  );
}
