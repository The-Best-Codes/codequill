import { UseSnippetsReturn } from "@/routes/home/types";
import Editor, { OnMount } from "@monaco-editor/react";
import React, { useRef } from "react";

interface EditorProps
  extends Pick<UseSnippetsReturn, "language" | "code" | "setCode"> {}

const MonacoEditorComponent: React.FC<EditorProps> = ({
  language,
  code,
  setCode,
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
