import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UseSnippetsReturn } from "@/routes/home/types";
import Editor, { OnMount } from "@monaco-editor/react";
import Plus from "lucide-react/dist/esm/icons/plus";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface EditorProps
  extends Pick<
    UseSnippetsReturn,
    | "language"
    | "code"
    | "setCode"
    | "saveCurrentSnippet"
    | "isPreviewing"
    | "isPreviewable"
    | "togglePreview"
    | "snippets"
  > {
  setIsSearchDialogOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  createNewSnippet: () => void;
}

const MonacoEditorComponent: React.FC<EditorProps> = ({
  language,
  code,
  setCode,
  saveCurrentSnippet,
  setIsSearchDialogOpen,
  isPreviewing,
  isPreviewable,
  togglePreview,
  toggleSidebar,
  createNewSnippet,
  snippets,
}) => {
  const editorRef = useRef<any>(null);
  const editorInstance = useRef<any>(null);
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editorInstance.current = editor; // Store the editor instance

    // Define and register the vs-dark-muted theme
    monaco.editor.defineTheme("vs-dark-muted", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "9ca3af", background: "1f2937" },
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "8b5cf6" },
        { token: "string", foreground: "10b981" },
        { token: "number", foreground: "f59e0b" },
        { token: "regexp", foreground: "f59e0b" },
        { token: "type", foreground: "3b82f6" },
        { token: "class", foreground: "3b82f6" },
        { token: "function", foreground: "06b6d4" },
        { token: "variable", foreground: "e5e7eb" },
        { token: "constant", foreground: "ef4444" },
        { token: "attribute", foreground: "f59e0b" },
        { token: "tag", foreground: "ef4444" },
        { token: "operator", foreground: "d1d5db" },
        { token: "delimiter", foreground: "d1d5db" },
      ],
      colors: {
        "editor.background": "#1f2937",
        "editor.foreground": "#9ca3af",
        "editor.lineHighlightBackground": "#374151",
        "editor.selectionBackground": "#4b5563",
        "editor.inactiveSelectionBackground": "#374151",
        "editorCursor.foreground": "#f3f4f6",
        "editorWhitespace.foreground": "#4b5563",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editor.selectionHighlightBackground": "#4b5563",
        "editor.wordHighlightBackground": "#374151",
        "editor.wordHighlightStrongBackground": "#4b5563",
        "editorBracketMatch.background": "#4b5563",
        "editorBracketMatch.border": "#6b7280",
        "editorGutter.background": "#1f2937",
        "editorGutter.modifiedBackground": "#f59e0b",
        "editorGutter.addedBackground": "#10b981",
        "editorGutter.deletedBackground": "#ef4444",
        "editorError.foreground": "#ef4444",
        "editorWarning.foreground": "#f59e0b",
        "editorInfo.foreground": "#3b82f6",
        "editorHint.foreground": "#6b7280",
        "scrollbar.shadow": "#00000050",
        "scrollbarSlider.background": "#4b556380",
        "scrollbarSlider.hoverBackground": "#6b728080",
        "scrollbarSlider.activeBackground": "#9ca3af80",
      },
    });

    // Override Monaco's Ctrl+K command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      setIsSearchDialogOpen(true);
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const hasSnippets = snippets.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && hasSnippets) {
        e.preventDefault();
        saveCurrentSnippet();
      }

      // Global Ctrl+K handler (fires if Monaco's doesn't, i.e., editor not focused)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (!editorInstance.current || !editorRef.current.hasTextFocus()) {
          setIsSearchDialogOpen(true);
        }
      }

      // Toggle preview with Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === "p" && isPreviewable) {
        e.preventDefault();
        togglePreview();
      }

      // Toggle sidebar with Ctrl+B / Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }

      // Create new snippet with Ctrl+N / Cmd+N
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        createNewSnippet();
      }

      // Open settings with Ctrl+, / Cmd+,
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        navigate("/settings"); // Navigate to settings
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    saveCurrentSnippet,
    setIsSearchDialogOpen,
    isPreviewable,
    togglePreview,
    toggleSidebar,
    createNewSnippet,
    navigate,
    hasSnippets,
  ]);

  const themeKeys = {
    light: "vs-light",
    dark: "vs-dark",
    dim: "vs-dark-muted",
  };

  type ThemeKey = keyof typeof themeKeys;

  // Determine the Monaco theme based on the resolved next-themes theme
  const monacoTheme =
    themeKeys[(resolvedTheme || "light") as ThemeKey] || "vs-light";

  return (
    <div
      className="flex-1 relative"
      style={{ height: isPreviewing ? "50%" : "100%" }}
    >
      {!hasSnippets ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Sparkles className="w-12 h-12 sm:w-24 sm:h-24 text-primary" />
          <span className="text-sm sm:text-base text-center text-muted-foreground">
            {t("youDonTHaveAnySnippets")}
          </span>
          <Button
            variant="outline"
            onClick={() => createNewSnippet()}
            className="mt-4"
          >
            <Plus className="w-5 h-5" />
            {t("createNewSnippet")}
          </Button>
        </div>
      ) : (
        <Editor
          width="100%"
          height="100%"
          loading={<Skeleton className="flex flex-1 w-full h-full" />}
          language={language?.id || "plaintext"}
          theme={monacoTheme}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
        />
      )}
    </div>
  );
};

export default MonacoEditorComponent;
