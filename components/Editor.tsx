import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const languageOptions = ["javascript", "typescript", "python", "html", "css"];

const CodeEditor = ({ selectedProject, refreshProjects }: any) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [name, setName] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (selectedProject) {
      setCode(selectedProject.code);
      setLanguage(selectedProject.language);
      setName(selectedProject.name);
    } else {
      setCode("");
      setLanguage("javascript");
      setName("");
    }
  }, [selectedProject]);

  const handleSave = () => {
    if (selectedProject) {
      axios
        .put(`/api/projects/${selectedProject.id}`, { name, code, language })
        .then(() => {
          refreshProjects();
        });
    } else {
      axios.post("/api/projects", { name, code, language }).then(() => {
        refreshProjects();
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded"
        >
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Save
        </button>
        {language === "javascript" || language === "html" ? (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-gray-500 text-white p-2 rounded ml-4"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        ) : null}
      </div>
      <div className="flex-1 flex">
        <Editor
          height={
            showPreview && (language === "javascript" || language === "html")
              ? "50%"
              : "100%"
          }
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
        />
        {showPreview && (language === "javascript" || language === "html") && (
          <iframe
            srcDoc={language === "html" ? code : `<script>${code}</script>`}
            className="w-full h-1/2 border-t"
          />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
