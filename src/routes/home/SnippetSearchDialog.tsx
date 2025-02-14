import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UseSnippetsReturn } from "@/routes/home/types";
import { useState } from "react";

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-96 flex flex-col h-full">
        <DialogHeader>
          <DialogTitle>Search Snippets</DialogTitle>
          <DialogDescription>
            Search through your snippets to quickly open them.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Type to search snippets..."
            value={value}
            onValueChange={setValue}
          />
          <ScrollArea className="h-full">
            <CommandEmpty>No snippets found.</CommandEmpty>
            <CommandGroup>
              {filteredSnippets.map((snippet) => (
                <CommandItem
                  key={snippet.id}
                  value={snippet.filename}
                  onSelect={() => {
                    loadSnippetInEditor(snippet.id);
                    setOpen(false);
                  }}
                >
                  {snippet.filename}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SnippetSearchDialog;
