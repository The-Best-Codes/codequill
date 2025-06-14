import supportedLanguages from "@/assets/supportedLanguages.json";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Check from "lucide-react/dist/esm/icons/check";
import ChevronsUpDown from "lucide-react/dist/esm/icons/chevrons-up-down";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Language } from "./types";

interface LanguageSelectorProps {
  language: Language | null;
  setLanguage: (language: Language | null) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguage,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(""); // Initialize to empty string
  const { t } = useTranslation();

  // Update the internal 'value' state whenever the 'language' prop changes.
  useEffect(() => {
    setValue(language?.id || "");
  }, [language]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-60 justify-between"
        >
          {value
            ? supportedLanguages.find((l) => l.id === value)?.name
            : t("selectLanguage")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput placeholder={t("searchLanguage")} className="h-9" />
          <CommandList>
            <CommandEmpty>{t("noLanguageFound")}</CommandEmpty>
            <CommandGroup>
              {supportedLanguages.map((l) => (
                <CommandItem
                  key={l.id}
                  value={l.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    setLanguage(
                      supportedLanguages.find(
                        (l) => l.id === currentValue,
                      ) as Language,
                    );
                  }}
                >
                  {l.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === l.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
