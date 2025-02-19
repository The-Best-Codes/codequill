import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseSnippetsReturn } from "@/routes/home/types";
import { Inbox } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SnippetSearchDialogProps
  extends Pick<UseSnippetsReturn, "filteredSnippets" | "loadSnippetInEditor"> {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SnippetSearchDialog: React.FC<SnippetSearchDialogProps> = ({
  open,
  setOpen,
  filteredSnippets,
  loadSnippetInEditor,
}) => {
  const [value, setValue] = useState("");
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-96 flex flex-col h-full">
        <DialogHeader>
          <DialogTitle>{t("searchSnippets")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("typeToSearch")}
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder={t("typeToSearch")}
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty className="w-full mt-8 flex flex-col items-center justify-center">
              <Inbox className="w-10 h-10 text-muted-foreground" />
              <span>{t("noSnippetsFound")}</span>
            </CommandEmpty>
            <CommandGroup>
              {filteredSnippets.map((snippet) => (
                <CommandItem
                  key={snippet.id}
                  value={`${snippet.filename} ${snippet.id}`}
                  onSelect={() => {
                    loadSnippetInEditor(snippet.id);
                    setOpen(false);
                  }}
                >
                  {snippet.filename}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SnippetSearchDialog;
