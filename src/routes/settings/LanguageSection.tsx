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
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface LanguageSectionProps {
  appLanguage: string;
  setAppLanguage: (language: string) => void;
  availableLanguages: { code: string; name: string }[];
  i18n: any;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({
  appLanguage,
  setAppLanguage,
  availableLanguages,
  i18n,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t("appLanguage")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("selectAppLanguage")}
        </p>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-52 justify-between"
          >
            {availableLanguages.find((l) => l.code === appLanguage)?.name ||
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
                {availableLanguages.map((l) => (
                  <CommandItem
                    key={l.code}
                    value={`${l.name} (${l.code})`}
                    onSelect={() => {
                      setAppLanguage(l.code);
                      i18n.changeLanguage(l.code);
                      setOpen(false);
                    }}
                  >
                    {l.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        appLanguage === l.code ? "opacity-100" : "opacity-0",
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

export default LanguageSection;
