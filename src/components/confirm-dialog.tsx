import { Button, Dialog, Portal, UseDialogReturn } from "@chakra-ui/react";
import { ReactNode, useRef } from "react";

export default function ConfirmDialog(props: { value: UseDialogReturn; confirmCallback: () => void; children: ReactNode }) {
  const ref = useRef(null);

  return (
    <Dialog.RootProvider value={props.value} placement={"center"}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {props.children}
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant={"outline"}>Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                ref={ref}
                onClick={() => {
                  props.value.setOpen(false);
                  props.confirmCallback();
                }}
              >
                Confirm
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
