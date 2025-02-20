import supportedLanguages from "@/assets/supportedLanguages.json";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getConfig, updateConfig } from "@/utils/config";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import packageJson from "../../../package.json";
import { Language } from "../home/types";
import AppInfoSection from "./AppInfoSection";
import DependenciesSection from "./DependenciesSection";
import KeyboardShortcutsSection from "./KeyboardShortcutsSection";
import ProgrammingLanguageSection from "./ProgrammingLanguageSection";
import ThemeSection from "./ThemeSection";

const APP_VERSION = packageJson.version;

function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>(
    getConfig().defaultLanguage,
  );

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
          <ThemeSection theme={theme} setTheme={setTheme} />

          <Separator />

          <ProgrammingLanguageSection
            language={language}
            setLanguage={setLanguage}
            supportedLanguages={supportedLanguages}
          />

          <Separator />

          <KeyboardShortcutsSection />

          <Separator />

          <AppInfoSection
            packageJson={packageJson}
            APP_VERSION={APP_VERSION}
            t={t}
          />

          <Separator />

          <DependenciesSection packageJson={packageJson} t={t} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
