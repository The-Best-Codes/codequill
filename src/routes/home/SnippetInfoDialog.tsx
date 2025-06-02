import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Snippet } from "@/utils/database";
import { Calendar, File, Hash, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SnippetInfoDialogProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  snippet: Snippet | null;
}

const SnippetInfoDialog: React.FC<SnippetInfoDialogProps> = ({
  isOpen,
  setOpen,
  snippet,
}) => {
  const { t } = useTranslation();

  if (!snippet) {
    return null; // Or render a message like "No snippet selected"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("snippetInformation")}</DialogTitle>
          <DialogDescription>{t("snippetDetails")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
            <Label
              htmlFor="id"
              className="text-right font-medium flex items-center"
            >
              <Hash className="mr-2 h-4 w-4 text-gray-500" />
              {t("id")}:
            </Label>
            <Input
              id="id"
              value={snippet.id}
              readOnly
              className="col-span-3 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
            <Label
              htmlFor="filename"
              className="text-right font-medium flex items-center"
            >
              <File className="mr-2 h-4 w-4 text-gray-500" />
              {t("filename")}:
            </Label>
            <Input
              id="filename"
              value={snippet.filename}
              readOnly
              className="col-span-3 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
            <Label
              htmlFor="language"
              className="text-right font-medium flex items-center"
            >
              <Languages className="mr-2 h-4 w-4 text-gray-500" />
              {t("language")}:
            </Label>
            <Input
              id="language"
              value={snippet.language}
              readOnly
              className="col-span-3 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
            <Label
              htmlFor="createdAt"
              className="text-right font-medium flex items-center"
            >
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              {t("lastSaved")}:
            </Label>
            <Input
              id="createdAt"
              value={
                snippet.created_at
                  ? new Date(snippet.created_at).toLocaleString()
                  : t("notAvailable") //@TODO:TRANSLATE
              }
              readOnly
              className="col-span-3 cursor-not-allowed"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SnippetInfoDialog;
