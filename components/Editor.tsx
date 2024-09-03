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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Check,
  Info,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Wand2,
  Languages,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import { generateAIName } from "@/utils/aiName";
import { translateCodeAI } from "@/utils/aiTranslate";

const DEFAULT_LANGUAGE = "html";

const languageOptions = [
  "auto",
  "html",
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "php",
  "css",
  "scss",
  "less",
  "markdown",
  "json",
  "yaml",
  "xml",
  "bash",
  "sql",
  "go",
  "rust",
  "dart",
  "kotlin",
  "swift",
  "ruby",
  "objective-c",
  "perl",
  "powershell",
  "r",
  "scala",
  "shellscript",
  "vb",
  "lua",
  "fsharp",
  "groovy",
  "ini",
  "java",
  "latex",
  "matlab",
  "pascal",
  "plaintext",
  "pug",
  "restructuredtext",
  "vhdl",
  "vue",
  "coffeescript",
  "dockerfile",
  "graphql",
  "handlebars",
  "mips",
  "razor",
  "redis",
  "solidity",
];

const langIndex: { [key: string]: string } = {
  auto: "Auto",
  html: "HTML",
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  php: "PHP",
  css: "CSS",
  scss: "SCSS",
  less: "LESS",
  markdown: "Markdown",
  json: "JSON",
  yaml: "YAML",
  xml: "XML",
  bash: "Bash",
  sql: "SQL",
  go: "Go",
  rust: "Rust",
  dart: "Dart",
  kotlin: "Kotlin",
  swift: "Swift",
  ruby: "Ruby",
  "objective-c": "Objective-C",
  perl: "Perl",
  powershell: "PowerShell",
  r: "R",
  scala: "Scala",
  shellscript: "ShellScript",
  vb: "VB",
  lua: "Lua",
  fsharp: "F#",
  groovy: "Groovy",
  ini: "INI",
  latex: "LaTeX",
  matlab: "MATLAB",
  pascal: "Pascal",
  plaintext: "Plain Text",
  pug: "Pug",
  restructuredtext: "reStructuredText",
  vhdl: "VHDL",
  vue: "Vue",
  coffeescript: "CoffeeScript",
  dockerfile: "Dockerfile",
  graphql: "GraphQL",
  handlebars: "Handlebars",
  mips: "MIPS",
  razor: "Razor",
  redis: "Redis",
  solidity: "Solidity",
  typescript: "TypeScript",
};

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
  const [name, setName] = useState(`${t("untitled") || "Untitled"}`);
  const [showPreview, setShowPreview] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [editorWidth, setEditorWidth] = useState("100%");
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const nameGeneratorRef = useRef(new AbortController());
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
          setName(project?.name || `${t("untitled")}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setCode("");
      setLanguage(defaultLanguage);
      setName(`${t("untitled")}`);
    }
  }, [selectedProject, defaultLanguage, t]);

  useEffect(() => {
    // Set dark mode based on system preference
    if (typeof window === "undefined") return;
    let prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (typeof localStorage !== "undefined") {
      if (localStorage.getItem("darkMode") === null) {
        prefersDarkMode = false;
        return;
      }
      prefersDarkMode = localStorage.getItem("darkMode") === "true";
    }
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

  const translateProject = async () => {
    if (code) {
      try {
        const translatedCode = await translateCodeAI(code, "Spanish");
        setCode(translatedCode);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openAboutAINameGenerator = () => {
    if (typeof window !== "undefined") {
      window.open(
        "https://github.com/The-Best-Codes/codequill?tab=readme-ov-file#ai-project-name-generator",
        "_blank"
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
                  {isGeneratingName ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
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
                    {langIndex[lang] || lang}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/*           <Button
            onClick={translateProject}
            size={"icon"}
            disabled={isSaving || isLoading}
          >
            <Languages />
          </Button> */}
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
              disabled={language !== "html" || isLoading}
              className="w-10 p-2 sm:w-fit sm:p-4"
            >
              {language === "html" ? (
                showPreview ? (
                  <>
                    <EyeOff className="inline-block" />{" "}
                    <span className="hidden ml-2 sm:inline-block">
                      {t("hide-preview")}
                    </span>
                  </>
                ) : (
                  <>
                    <Eye className="inline-block" />{" "}
                    <span className="hidden ml-2 sm:inline-block">
                      {t("show-preview")}
                    </span>
                  </>
                )
              ) : (
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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <>
            <Editor
              height={showPreview && language === "html" ? "50%" : "100%"}
              className="dark:invert"
              width="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              //theme={(darkMode ? "vs-dark" : "vs-light") as any}
              theme="vs-light"
            />
            {showPreview && language === "html" && (
              <iframe
                srcDoc={code}
                className="w-full h-1/2 border-t dark:border-gray-700"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
