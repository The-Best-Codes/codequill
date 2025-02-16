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
          <DialogDescription className="sr-only">
            Quickly search and open snippets.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Type to search snippets..."
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty>No snippets found.</CommandEmpty>
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
