import { UseSnippetsReturn } from "@/routes/home/types";
import Editor, { OnMount } from "@monaco-editor/react";
import React, { useEffect, useRef } from "react";

interface EditorProps
  extends Pick<
    UseSnippetsReturn,
    "language" | "code" | "setCode" | "saveCurrentSnippet"
  > {}

const MonacoEditorComponent: React.FC<EditorProps> = ({
  language,
  code,
  setCode,
  saveCurrentSnippet,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
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
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveCurrentSnippet]);

  return (
    <div className="flex-1 relative">
      <Editor
        width="100%"
        height="100%"
        language={language?.id || "plaintext"}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default MonacoEditorComponent;
