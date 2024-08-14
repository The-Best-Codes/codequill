import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Info, Loader2 } from "lucide-react";
import { useTranslation } from "@/app/i18n";

const DEFAULT_LANGUAGE = "html";

const languageOptions = [
  "auto",
  "html",
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "php",
  "css",
];

const getStoredDefaultLanguage = () => {
  if (typeof window === "undefined" || !localStorage.getItem("defaultLanguage"))
    return "javascript";
  return localStorage.getItem("defaultLanguage") || "javascript";
};

const setStoredDefaultLanguage = (language: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("defaultLanguage", language);
};

const CodeEditor = ({
  selectedProject,
  setSelectedProject,
  refreshProjects,
}: any) => {
  const { t } = useTranslation("common");
  const [code, setCode] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState(
    getStoredDefaultLanguage()
  );
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [name, setName] = useState("Untitled");
  const [showPreview, setShowPreview] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [editorWidth, setEditorWidth] = useState("100%");
  const containerRef = useRef(null);

  const updateDefaultLanguage = (newLanguage: string) => {
    setDefaultLanguage(newLanguage);
    setStoredDefaultLanguage(newLanguage);
  };

  useEffect(() => {
    if (selectedProject) {
      setIsLoading(true);
      axios
        .get(`/api/projects/${selectedProject.id}`)
        .then((response) => {
          const project = response.data;
          setCode(project.code);
          setLanguage(project.language);
          setName(project?.name || "Untitled");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setCode("");
      setLanguage(defaultLanguage);
      setName("Untitled");
    }
  }, [selectedProject, defaultLanguage]);

  useEffect(() => {
    // Set dark mode based on system preference
    if (typeof window === "undefined") return;
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setEditorWidth(`${(containerRef.current as any).offsetWidth}px`);
      }
    };

    handleResize(); // Call once to set initial size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess("Saving...");
    try {
      if (selectedProject) {
        await axios.put(`/api/projects/${selectedProject.id}`, {
          name,
          code,
          language,
        });
      } else {
        const response = await axios.post("/api/projects", {
          name,
          code,
          language,
        });
        const project = await response.data;
        if (!project) return;
        setSelectedProject({ ...project, code, language, name });
      }
      refreshProjects();
      setSaveSuccess("Saved");
      setTimeout(() => {
        setSaveSuccess("");
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      setSaveSuccess("Error");
      setTimeout(() => {
        setSaveSuccess("");
        setIsSaving(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-4 bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
        <div className="flex items-center flex-row gap-4 w-1/2">
          <Input
            type="text"
            placeholder={t("project-name")}
            value={name}
            minLength={2}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded w-24 sm:w-32 md:w-48 lg:w-64 xl:w-72 text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
            disabled={isLoading}
          />
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-fit text-black dark:text-white dark:border-gray-700 dark:bg-gray-800">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectGroup>
                <SelectLabel className="dark:text-white dark:bg-gray-800">
                  {t("language")}
                </SelectLabel>
                {languageOptions.map((lang) => (
                  <SelectItem
                    className="dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                    key={lang}
                    value={lang}
                  >
                    {lang}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-end flex-row gap-4 w-1/2">
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {saveSuccess === "Saving..." && `${t("saving-ellipsis")}`}
            {saveSuccess === "Saved" && (
              <>
                <Check className="inline-block mr-2" /> {t("saved")}
              </>
            )}
            {saveSuccess === "Error" && (
              <>
                <Info className="inline-block mr-2" /> {t("error")}
              </>
            )}
            {!saveSuccess && t("save")}
          </Button>
          {
            <Button
              onClick={() => setShowPreview(!showPreview)}
              disabled={language !== "html" || isLoading}
            >
              {language === "html"
                ? showPreview
                  ? `${t("hide-preview")}`
                  : `${t("show-preview")}`
                : `${t("show-preview")}`}
            </Button>
          }
          {/* <Select
            value={defaultLanguage}
            onValueChange={updateDefaultLanguage}
            disabled={isLoading}
          >
            <SelectTrigger className="w-1/4 text-black">
              <SelectValue placeholder="Default Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Default Language</SelectLabel>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </div>
      </div>
      <div className="w-full h-full flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <>
            <Editor
              height={showPreview && language === "html" ? "50%" : "100%"}
              width="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={(darkMode ? "vs-dark" : "vs-light") as any}
            />
            {showPreview && language === "html" && (
              <iframe srcDoc={code} className="w-full h-1/2" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
