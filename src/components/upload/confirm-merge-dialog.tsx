import { Button, Dialog, Portal, UseDialogReturn } from "@chakra-ui/react";
import { useRef } from "react";

export default function ConfirmMergeDialog(props: { value: UseDialogReturn; confirmCallback: () => void }) {
  const ref = useRef(null);

  return (
    <Dialog.RootProvider value={props.value} placement={"center"}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Are you sure?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description>This will automatically split all your files.</Dialog.Description>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant={"outline"}>No</Button>
              </Dialog.ActionTrigger>
              <Button
                ref={ref}
                onClick={() => {
                  props.value.setOpen(false);
                  props.confirmCallback();
                }}
              >
                Yes
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
