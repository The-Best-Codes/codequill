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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteThisSnippet")}</DialogTitle>
          <DialogDescription>{t("thisActionCannotBeUndone")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
