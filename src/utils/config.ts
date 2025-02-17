import supportedLanguages from "@/assets/supportedLanguages.json";
import { Language } from "@/routes/home/types";

interface Config {
  defaultLanguage: Language;
}

const defaultConfig: Config = {
  defaultLanguage: supportedLanguages[0] as Language,
};

const CONFIG_KEY = "config";

// Define a type for the supported languages from the JSON file
interface SupportedLanguage {
  id: string;
  name: string;
  shortName: string;
  files: string[];
}

export const getConfig = (): Config => {
  if (typeof window !== "undefined") {
    const storedConfig = localStorage.getItem(CONFIG_KEY);
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig) as Config;
        // Validate the stored config to ensure the language is valid
        if (
          parsedConfig.defaultLanguage &&
          (supportedLanguages as SupportedLanguage[]).some(
            (lang) => lang.id === parsedConfig.defaultLanguage.id,
          )
        ) {
          return parsedConfig;
        } else {
          console.warn("Invalid config in localStorage, using default.");
          return defaultConfig;
        }
      } catch (error) {
        console.error("Error parsing config from localStorage:", error);
        return defaultConfig;
      }
    }
  }
  return defaultConfig;
};

export const updateConfig = (newConfig: Partial<Config>): void => {
  if (typeof window !== "undefined") {
    const currentConfig = getConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(updatedConfig));
    } catch (error) {
      console.error("Error saving config to localStorage:", error);
    }
  }
};

export const getDefaultLanguage = (): Language => {
  return getConfig().defaultLanguage;
};
