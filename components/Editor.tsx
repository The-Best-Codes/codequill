import { useState, useEffect } from "react";
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
import { Check, Info } from "lucide-react";

const languageOptions = ["javascript", "typescript", "python", "html", "css"];

const CodeEditor = ({ selectedProject, refreshProjects }: any) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [name, setName] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState("");

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
    try {
      if (selectedProject) {
        setSaveSuccess("Saving...");
        axios
          .put(`/api/projects/${selectedProject.id}`, { name, code, language })
          .then(() => {
            refreshProjects();
          });
        setSaveSuccess("Saved");
      } else {
        axios.post("/api/projects", { name, code, language }).then(() => {
          refreshProjects();
        });
      }
    } catch (error) {
      setSaveSuccess("Error");
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <div className="flex items-center flex-row gap-4 w-1/2">
          <Input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded w-1/4"
          />
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-1/4">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Language</SelectLabel>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-end flex-row gap-4 w-1/2">
          <Button onClick={handleSave}>{saveSuccess || "Save"}</Button>
          {
            <Button
              onClick={() => setShowPreview(!showPreview)}
              disabled={language !== "html"}
            >
              {language === "html"
                ? showPreview
                  ? "Hide Preview"
                  : "Show Preview"
                : "Show Preview"}
            </Button>
          }
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <Editor
          height={showPreview && language === "html" ? "50%" : "100%"}
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
        />
        {showPreview && language === "html" && (
          <iframe srcDoc={code} className="w-full h-1/2 border-t" />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
