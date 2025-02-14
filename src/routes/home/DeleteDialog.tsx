import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface DeleteDialogProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  setOpen,
  isDeleting,
  onDelete,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this snippet?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            snippet.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
