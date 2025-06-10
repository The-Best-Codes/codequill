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
import { Language } from "@/routes/home/types";
import Check from "lucide-react/dist/esm/icons/check";
import ChevronsUpDown from "lucide-react/dist/esm/icons/chevrons-up-down";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageSectionProps {
  language: Language;
  setLanguage: (language: Language) => void;
  supportedLanguages: Language[];
}

const ProgrammingLanguageSection: React.FC<LanguageSectionProps> = ({
  language,
  setLanguage,
  supportedLanguages,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t("defaultLanguage")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("defaultProgrammingLanguage")}
        </p>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-64 justify-between"
          >
            {supportedLanguages.find((l) => l.id === language.id)?.name ||
              t("selectLanguage")}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
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
                      const selectedLanguage = supportedLanguages.find(
                        (l) => l.id === currentValue,
                      ) as Language;
                      setLanguage(selectedLanguage);
                      setOpen(false);
                    }}
                  >
                    {l.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        language.id === l.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProgrammingLanguageSection;
