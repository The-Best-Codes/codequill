import { UseSnippetsReturn } from "@/routes/home/types";
import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

interface EditorProps
  extends Pick<
    UseSnippetsReturn,
    "language" | "code" | "setCode" | "saveCurrentSnippet" | "isPreviewing"
  > {
  setIsSearchDialogOpen: (open: boolean) => void;
}

const MonacoEditorComponent: React.FC<EditorProps> = ({
  language,
  code,
  setCode,
  saveCurrentSnippet,
  setIsSearchDialogOpen,
  isPreviewing,
}) => {
  const editorRef = useRef<any>(null);
  const editorInstance = useRef<any>(null);
  const { resolvedTheme } = useTheme();

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
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
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveCurrentSnippet, setIsSearchDialogOpen]);

  // Determine the Monaco theme based on the resolved next-themes theme
  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "vs-light";

  return (
    <div
      className="flex-1 relative"
      style={{ height: isPreviewing ? "50%" : "100%" }}
    >
      <Editor
        width="100%"
        height="100%"
        language={language?.id || "plaintext"}
        theme={monacoTheme} // Set the theme dynamically
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default MonacoEditorComponent;
