import React from 'react';
import { Dialog, DialogContent} from "@/components/ui/dialog";

type ModalProps = {
  submitFn?: () => void;
  closeModal?: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ closeModal, children }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    closeModal?.();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-w-lg p-6 rounded-2xl shadow-lg">
        <div className="mt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
