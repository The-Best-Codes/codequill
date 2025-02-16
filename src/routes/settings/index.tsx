import supportedLanguages from "@/assets/supportedLanguages.json";
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
import { Language } from "../home/types";

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
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
