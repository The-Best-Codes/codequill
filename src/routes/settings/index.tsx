import supportedLanguages from "@/assets/supportedLanguages.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getConfig, updateConfig } from "@/utils/config";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import packageJson from "../../../package.json";
import { Language } from "../home/types";

const APP_VERSION = packageJson.version;

function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>(
    getConfig().defaultLanguage,
  );
  const [open, setOpen] = useState(false);

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    // Update the config whenever the language changes
    updateConfig({ defaultLanguage: language });
  }, [language]);

  const productionDependencies = packageJson.dependencies || {};
  const developmentDependencies = packageJson.devDependencies || {};

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                {t("settings")}
              </CardTitle>
              <CardDescription className="mt-1.5">
                {t("customizeYourExperience")}
              </CardDescription>
            </div>
            <Button variant="default" onClick={handleBack}>
              {t("backToEditor")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{t("theme")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("chooseYourPreferredAppearance")}
              </p>
            </div>
            <RadioGroup
              defaultValue={theme || "system"}
              onValueChange={setTheme}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {["light", "dark", "system"].map((value) => (
                <Label
                  key={value}
                  className="cursor-pointer [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-secondary transition-colors">
                    <RadioGroupItem value={value} id={value} />
                    <span className="capitalize">
                      {t(
                        `theme${value.charAt(0).toUpperCase() + value.slice(1)}`,
                      )}
                    </span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Language Section */}
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
                  <CommandInput
                    placeholder={t("searchLanguage")}
                    className="h-9"
                  />
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
                              language.id === l.id
                                ? "opacity-100"
                                : "opacity-0",
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

          <Separator />

          {/* Keyboard Shortcuts Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">
                {t("keyboardShortcuts")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("viewCommonKeyboardShortcuts")}
              </p>
            </div>
            <div className="grid gap-4">
              {[
                { label: t("saveSnippet"), shortcut: "Ctrl + S" },
                { label: t("createNewSnippet"), shortcut: "Ctrl + N" },
                { label: t("toggleSidebar"), shortcut: "Ctrl + B" },
                { label: t("searchSnippets"), shortcut: "Ctrl + K" },
                { label: t("previewCode"), shortcut: "Ctrl + P" },
                { label: t("openSettings"), shortcut: "Ctrl + Comma" },
                { label: t("formatCode"), shortcut: "Ctrl + Shift + I" },
                { label: t("undo"), shortcut: "Ctrl + Z" },
                { label: t("redo"), shortcut: "Ctrl + Y" },
              ].map(({ label, shortcut }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <Label className="font-medium">{label}</Label>
                  <code className="rounded bg-secondary px-2 py-1 text-sm">
                    {shortcut}
                  </code>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{t("appInfo")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("informationAboutCodeQuill")}
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-lg border p-6 space-y-4">
                <div>
                  <h4 className="text-xl font-semibold">{packageJson.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {packageJson.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="font-medium">{t("version")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("installedVersion")}
                    </p>
                  </div>
                  <code className="rounded px-3 py-1 text-sm font-semibold">
                    {APP_VERSION}
                  </code>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="font-medium">{t("license")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("openSource")}
                    </p>
                  </div>
                  <code className="rounded px-3 py-1 text-sm font-semibold">
                    {packageJson.license}
                  </code>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{t("createdBy")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {packageJson.author.name}
                    </p>
                  </div>
                  <a
                    href={packageJson.author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {t("website")}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={packageJson.repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full"
                  >
                    {t("sourceCode")}
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="https://github.com/The-Best-Codes/codequill/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full"
                  >
                    {t("reportIssue")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{t("dependencies")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("librariesUsed")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="font-medium">{t("production")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("librariesBundled")}
                  </p>
                </div>
                <code className="rounded px-3 py-1 text-sm font-semibold">
                  {Object.keys(productionDependencies).length}
                </code>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="font-medium">{t("development")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("librariesUsedDevelopment")}
                  </p>
                </div>
                <code className="rounded px-3 py-1 text-sm font-semibold">
                  {Object.keys(developmentDependencies).length}
                </code>
              </div>
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem value="production">
                <AccordionTrigger>
                  {t("productionDependencies")}
                </AccordionTrigger>
                <AccordionContent className="max-h-96 overflow-auto">
                  <div className="grid gap-4">
                    {Object.entries(productionDependencies).map(
                      ([name, version]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <Label className="font-medium">
                            <a
                              className="text-blue-500 hover:underline"
                              href={`https://www.npmjs.com/package/${name}`}
                              target="_blank"
                            >
                              {name}
                            </a>
                          </Label>
                          <code className="rounded bg-secondary px-2 py-1 text-sm">
                            {version}
                          </code>
                        </div>
                      ),
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="development">
                <AccordionTrigger>
                  {t("developmentDependencies")}
                </AccordionTrigger>
                <AccordionContent className="max-h-96 overflow-auto">
                  <div className="grid gap-4">
                    {Object.entries(developmentDependencies).map(
                      ([name, version]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <Label className="font-medium">
                            <a
                              className="text-blue-500 hover:underline"
                              href={`https://www.npmjs.com/package/${name}`}
                              target="_blank"
                            >
                              {name}
                            </a>
                          </Label>
                          <code className="rounded bg-secondary px-2 py-1 text-sm">
                            {version}
                          </code>
                        </div>
                      ),
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
