import { useDialogStore } from "@/stores/dialog";
import {
  Description,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
} from "@headlessui/react";
import { Button } from "../ui";

export interface DialogProps {}

export const Dialog: React.FC<DialogProps> = () => {
  const isOpen = useDialogStore.use.isOpen();
  const content = useDialogStore.use.content();
  const closeDialog = useDialogStore.use.closeDialog();

  const { title, description, type, onClose = () => {} } = content;
  const handleClose = () => {
    onClose();
    closeDialog();
  };

  return (
    <HeadlessDialog
      open={isOpen}
      onClose={handleClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center bg-primary/30 p-4 backdrop-blur-sm">
        <DialogPanel className="max-w-lg rounded-lg bg-white px-10 py-6 shadow-lg">
          <DialogTitle className="mb-2 text-xl font-bold">{title}</DialogTitle>
          <Description className="mb-6 text-slate-600">
            {description}
          </Description>
          <div className="flex items-center justify-end gap-4">
            {type === "notice" && (
              <Button buttonStyle="secondary" onClick={handleClose}>
                {content.customText?.close ?? "閉じる"}
              </Button>
            )}
            {type === "confirm" && (
              <>
                <Button buttonStyle="secondary" onClick={handleClose}>
                  {content.customText?.close ?? "キャンセル"}
                </Button>
                <Button
                  buttonStyle={content.isWarning ? "warn" : "primary"}
                  onClick={() => {
                    content.onConfirm();
                    closeDialog();
                  }}
                >
                  {content.customText?.confirm ?? "OK"}
                </Button>
              </>
            )}
          </div>
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
};
