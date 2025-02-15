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
import { useTheme } from "next-themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme(); // Use next-themes hook
  const [language, setLanguage] = useState("en");

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 py-12">
      <div className="container p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Settings</CardTitle>
            <CardDescription>
              Manage your preferences to customize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="absolute top-4 right-4"
            >
              Back to Home
            </Button>

            <div className="grid gap-4">
              <Label htmlFor="theme">Theme</Label>
              <RadioGroup
                defaultValue={theme || "system"}
                onValueChange={setTheme}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4">
              <Label htmlFor="language">Default Language</Label>
              <Select onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  {/* Add more languages as needed */}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose your preferred language.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Account</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account settings.
              </p>
              <Button variant="outline" disabled className="mt-2">
                Change Email
              </Button>
              <Button variant="outline" disabled className="mt-2">
                Change Password
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-medium">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Manage your notification settings.
              </p>
              <Button variant="outline" disabled className="mt-2">
                Enable Notifications (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
