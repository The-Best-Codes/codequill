import { Button } from "@/components/ui/button";
import { UseSnippetsReturn } from "@/routes/home/types";
import Editor, { OnMount } from "@monaco-editor/react";
import { Plus, Sparkles } from "lucide-react";
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

  // Determine the Monaco theme based on the resolved next-themes theme
  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "vs-light";

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
