/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/bc_ui/combobox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Check, Eye, EyeOff, Info, Loader2, Save, Wand2 } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import JavaScriptConsole from "@/components/JSConsole";
import { generateAIName } from "@/utils/aiName";
import codeLangOptions from "@/utils/codeLangs";

const DEFAULT_LANGUAGE = "html";

const getStoredDefaultLanguage = () => {
  if (
    typeof window === "undefined" || !localStorage.getItem("defaultLanguage")
  ) {
    return "javascript";
  }
  return localStorage.getItem("defaultLanguage") || "javascript";
};

const CodeEditor = ({
  selectedProject,
  setSelectedProject,
  refreshProjects,
}: any) => {
  const { t } = useTranslation("common");
  const { theme, systemTheme } = useTheme();
  const [code, setCode] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [defaultLanguage, setDefaultLanguage] = useState(
    getStoredDefaultLanguage(),
  );
  const [codeLanguage, setCodeLanguage] = useState(DEFAULT_LANGUAGE);
  const [name, setName] = useState(`${t("untitled") || "Untitled"}`);
  const [showPreview, setShowPreview] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const nameGeneratorRef = useRef(new AbortController());

  useEffect(() => {
    if (selectedProject) {
      setIsLoading(true);
      axios
        .get(`/api/projects/${selectedProject.id}`)
        .then((response) => {
          const project = response.data;
          setCode(project.code);
          setCodeLanguage(project.language);
          setName(project?.name || `${t("untitled")}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setCode("");
      setCodeLanguage(defaultLanguage);
      setName(`${t("untitled")}`);
    }
  }, [selectedProject, defaultLanguage, t]);

  useEffect(() => {
    if (nameGeneratorRef.current) {
      nameGeneratorRef.current.abort();
    }
  }, [code]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess("Saving...");
    try {
      if (selectedProject) {
        await axios.put(`/api/projects/${selectedProject.id}`, {
          name,
          code,
          language: codeLanguage,
        });
      } else {
        const response = await axios.post("/api/projects", {
          name,
          code,
          language: codeLanguage,
        });
        const project = await response.data;
        if (!project) return;
        setSelectedProject({ ...project, code, language: codeLanguage, name });
      }
      refreshProjects();
      setSaveSuccess("Saved");
      setTimeout(() => {
        setSaveSuccess("");
        setIsSaving(false);
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSaveSuccess("Error");
      setTimeout(() => {
        setSaveSuccess("");
        setIsSaving(false);
      }, 1000);
    }
  };

  const ai_nameProject = async () => {
    if (nameGeneratorRef.current) {
      nameGeneratorRef.current.abort();
    }
    nameGeneratorRef.current = new AbortController();
    setIsGeneratingName(true);

    try {
      const name = await generateAIName(code);
      setName(name);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error("Failed to generate AI name:", error);
      }
    } finally {
      setIsGeneratingName(false);
    }

    return () => {
      nameGeneratorRef.current.abort(); // Cancel the request if needed
    };
  };

  const openAboutAINameGenerator = () => {
    if (typeof window !== "undefined") {
      window.open(
        "https://github.com/The-Best-Codes/codequill?tab=readme-ov-file#ai-project-name-generator",
        "_blank",
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-4 bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
        <div className="flex items-center flex-row gap-4 w-1/2">
          <div className="relative">
            <Input
              type="text"
              placeholder={t("project-name")}
              value={name}
              minLength={2}
              onChange={(e) => setName(e.target.value)}
              className="p-2 pr-10 border rounded w-full text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
              disabled={isLoading}
            />
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <Button
                  onClick={ai_nameProject}
                  disabled={isSaving || isLoading}
                  className={`absolute w-6 h-6 p-1 right-2 top-1/2 transform -translate-y-1/2 ${
                    isGeneratingName ? "cursor-wait" : ""
                  }`}
                >
                  {isGeneratingName
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Wand2 className="w-4 h-4" />}
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                <ContextMenuItem
                  className="dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={openAboutAINameGenerator}
                >
                  <Info className="w-4 h-4 mr-2" /> About
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
          <Combobox
            value={codeLanguage}
            onValueChange={(value) => setCodeLanguage(value)}
            disabled={isLoading}
            placeholder="Language"
            options={codeLangOptions}
            className="w-fit text-black dark:text-white dark:border-gray-700 dark:bg-gray-800"
            label="Language"
          />

          {
            /* <Button
            onClick={translateProject}
            size={"icon"}
            disabled={isSaving || isLoading}
          >
            <Languages />
          </Button> */
          }
        </div>
        <div className="flex items-center justify-end flex-row gap-4 w-1/2">
          <Button
            onClick={handleSave}
            className="w-10 p-2 sm:w-fit sm:p-4"
            disabled={isSaving || isLoading}
          >
            {saveSuccess === "Saving..." && (
              <>
                <Loader2 className="inline-block animate-spin" />{" "}
                <span className="hidden ml-2 sm:inline-block">
                  {t("saving-ellipsis")}
                </span>
              </>
            )}
            {saveSuccess === "Saved" && (
              <>
                <Check className="inline-block" />{" "}
                <span className="hidden ml-2 sm:inline-block">
                  {t("saved")}
                </span>
              </>
            )}
            {saveSuccess === "Error" && (
              <>
                <Info className="inline-block" />{" "}
                <span className="hidden ml-2 sm:inline-block">
                  {t("error")}
                </span>
              </>
            )}
            {!saveSuccess && (
              <>
                <Save className="inline-block" />{" "}
                <span className="hidden ml-2 sm:inline-block">{t("save")}</span>
              </>
            )}
          </Button>
          {
            <Button
              onClick={() => setShowPreview(!showPreview)}
              disabled={(codeLanguage !== "html" &&
                codeLanguage !== "javascript") ||
                isLoading}
              className="w-10 p-2 sm:w-fit sm:p-4"
            >
              {codeLanguage === "html" || codeLanguage === "javascript"
                ? (
                  showPreview
                    ? (
                      <>
                        <EyeOff className="inline-block" />{" "}
                        <span className="hidden ml-2 sm:inline-block">
                          {t("hide-preview")}
                        </span>
                      </>
                    )
                    : (
                      <>
                        <Eye className="inline-block" />{" "}
                        <span className="hidden ml-2 sm:inline-block">
                          {t("show-preview")}
                        </span>
                      </>
                    )
                )
                : (
                  <>
                    <Eye className="inline-block" />{" "}
                    <span className="hidden ml-2 sm:inline-block">
                      {t("show-preview")}
                    </span>
                  </>
                )}
            </Button>
          }
        </div>
      </div>
      <div className="w-full h-full flex flex-col">
        {isLoading
          ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )
          : (
            <>
              <Editor
                height={showPreview &&
                    (codeLanguage === "html" || codeLanguage === "javascript")
                  ? "50%"
                  : "100%"}
                width="100%"
                language={codeLanguage}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme={theme === "system"
                  ? systemTheme === "dark" ? "vs-dark" : "vs-light"
                  : theme === "dark"
                  ? "vs-dark"
                  : "vs-light"}
              />
              {showPreview && codeLanguage === "html" && (
                <iframe
                  srcDoc={code}
                  className="w-full h-1/2 border-t dark:border-gray-700"
                />
              )}
              {showPreview && codeLanguage === "javascript" && (
                <JavaScriptConsole code={code} />
              )}
            </>
          )}
      </div>
    </div>
  );
};

export default CodeEditor;
