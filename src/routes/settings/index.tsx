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
import { Check, ChevronsUpDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("plaintext");
  const [open, setOpen] = useState(false);

  const handleBack = () => {
    navigate("/");
  };

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
            <Button
              variant="outline"
              onClick={handleBack}
              className="hover:bg-secondary"
            >
              Back to Home
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Theme Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred appearance
              </p>
            </div>
            <RadioGroup
              defaultValue={theme || "system"}
              onValueChange={setTheme}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
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
                Choose your preferred programming language
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
                  {supportedLanguages.find((l) => l.id === language)?.name ||
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
                            setLanguage(currentValue);
                            setOpen(false);
                          }}
                        >
                          {l.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              language === l.id ? "opacity-100" : "opacity-0",
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
                { label: "Undo", shortcut: "Ctrl + Z" },
                { label: "Redo", shortcut: "Ctrl + Y" },
                { label: "Toggle Sidebar", shortcut: "Ctrl + B" },
                { label: "Format Code", shortcut: "Ctrl + Shift + I" },
                { label: "Search Snippets", shortcut: "Ctrl + K" },
                { label: "Preview Code", shortcut: "Ctrl + P" },
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
