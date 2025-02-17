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
import { useNavigate } from "react-router-dom";
import packageJson from "../../../package.json";
import { Language } from "../home/types";

const APP_VERSION = packageJson.version;

function Settings() {
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
              <CardTitle className="text-2xl font-bold">Settings</CardTitle>
              <CardDescription className="mt-1.5">
                Customize your CodeQuill experience
              </CardDescription>
            </div>
            <Button variant="default" onClick={handleBack}>
              Back to Editor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred app appearance
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
                    <span className="capitalize">{value}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Language Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Default Language</h3>
              <p className="text-sm text-muted-foreground">
                Default programming language for new snippets
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
                    "Select language..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search language..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
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
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <p className="text-sm text-muted-foreground">
                View common keyboard shortcuts
              </p>
            </div>
            <div className="grid gap-4">
              {[
                { label: "Save Snippet", shortcut: "Ctrl + S" },
                { label: "Create New Snippet", shortcut: "Ctrl + N" },
                { label: "Toggle Sidebar", shortcut: "Ctrl + B" },
                { label: "Search Snippets", shortcut: "Ctrl + K" },
                { label: "Preview Code", shortcut: "Ctrl + P" },
                { label: "Open Settings", shortcut: "Ctrl + Comma" },
                { label: "Format Code", shortcut: "Ctrl + Shift + I" },
                { label: "Undo", shortcut: "Ctrl + Z" },
                { label: "Redo", shortcut: "Ctrl + Y" },
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
              <h3 className="text-lg font-semibold">App Info</h3>
              <p className="text-sm text-muted-foreground">
                Information about CodeQuill
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
                    <Label className="font-medium">Version</Label>
                    <p className="text-sm text-muted-foreground">
                      Installed version
                    </p>
                  </div>
                  <code className="rounded px-3 py-1 text-sm font-semibold">
                    {APP_VERSION}
                  </code>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="font-medium">License</Label>
                    <p className="text-sm text-muted-foreground">Open source</p>
                  </div>
                  <code className="rounded px-3 py-1 text-sm font-semibold">
                    {packageJson.license}
                  </code>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Created By</Label>
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
                    Website
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
                    Source Code
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href="https://github.com/The-Best-Codes/codequill/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full"
                  >
                    Report Issue
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Dependencies</h3>
              <p className="text-sm text-muted-foreground">
                Libraries used in CodeQuill
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="font-medium">Production</Label>
                  <p className="text-sm text-muted-foreground">
                    Libraries bundled in the production build
                  </p>
                </div>
                <code className="rounded px-3 py-1 text-sm font-semibold">
                  {Object.keys(productionDependencies).length}
                </code>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="font-medium">Development</Label>
                  <p className="text-sm text-muted-foreground">
                    Libraries used in CodeQuill development
                  </p>
                </div>
                <code className="rounded px-3 py-1 text-sm font-semibold">
                  {Object.keys(developmentDependencies).length}
                </code>
              </div>
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem value="production">
                <AccordionTrigger>Production Dependencies</AccordionTrigger>
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
                <AccordionTrigger>Development Dependencies</AccordionTrigger>
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
