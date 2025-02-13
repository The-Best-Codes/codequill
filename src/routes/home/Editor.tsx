import { UseSnippetsReturn } from "@/routes/home/types";
import React, { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";

interface EditorProps
  extends Pick<UseSnippetsReturn, "language" | "code" | "setCode"> {}

const Editor: React.FC<EditorProps> = ({ language, code, setCode }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: EditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  return (
    <div className="flex-1 relative">
      <MonacoEditor
        width="100%"
        height="100%"
        language={language?.id || "plaintext"}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
        editorDidMount={handleEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "JetBrains Mono, monospace",
        }}
      />
    </div>
  );
};

export default Editor;
