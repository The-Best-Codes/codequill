import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("javascript");

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
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
              className="grid grid-cols-3 gap-4"
            >
              {["light", "dark", "system"].map((value) => (
                <div
                  key={value}
                  className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-secondary"
                >
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value} className="capitalize cursor-pointer">
                    {value}
                  </Label>
                </div>
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
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
              </SelectContent>
            </Select>
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
                { label: "Save", shortcut: "Ctrl + S" },
                { label: "Format Code", shortcut: "Shift + Alt + F" },
                { label: "New File", shortcut: "Ctrl + N" },
                { label: "Open File", shortcut: "Ctrl + O" },
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
