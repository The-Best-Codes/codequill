import supportedLanguages from "@/assets/supportedLanguages.json";
import { useToast } from "@/hooks/use-toast";
import {
  deleteSnippet,
  getAllSnippets,
  getSnippet,
  saveSnippet,
  Snippet,
} from "@/utils/database";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Language, UseSnippetsReturn } from "./types";

export const useSnippets = (): UseSnippetsReturn => {
  const [filename, setFilename] = useState<string>("Untitled");
  const [language, setLanguage] = useState<Language | null>(
    supportedLanguages[0] as Language,
  );
  const [code, setCode] = useState<string>("");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(
    null,
  );
  const { toast } = useToast();
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSnippets = getAllSnippets();
      setSnippets(loadedSnippets);

      if (loadedSnippets.length > 0) {
        loadSnippetInEditor(loadedSnippets[0].id);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load snippets.");
    } finally {
      setLoading(false);
    }
  };

  const createNewSnippet = () => {
    setFilename("Untitled");
    setLanguage(supportedLanguages[0] as Language);
    setCode("");
    setSelectedSnippetId(null);
  };

  const loadSnippetInEditor = (id: string) => {
    const snippet = getSnippet(id);
    if (snippet) {
      setFilename(snippet.filename);
      setLanguage(
        supportedLanguages.find((l) => l.id === snippet.language) as Language,
      );
      setCode(snippet.code);
      setSelectedSnippetId(snippet.id);
    }
  };

  const saveCurrentSnippet = async () => {
    try {
      setSaving(true);
      if (!language) {
        toast({
          title: "Error",
          description: "Please select a language",
        });
        return;
      }

      const snippetToSave: Snippet = {
        id: selectedSnippetId || uuidv4(),
        filename,
        language: language.id,
        code,
      };

      saveSnippet(snippetToSave);
      await loadSnippets(); // Use the local loadSnippets
      setSelectedSnippetId(snippetToSave.id);
      toast({
        title: "Success",
        description: "Snippet saved",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to save snippet.",
      });
    } finally {
      setSaving(false);
    }
  };

  const copySnippet = async (snippetId: string) => {
    const snippet = getSnippet(snippetId);
    if (snippet) {
      try {
        await navigator.clipboard.writeText(snippet.code);
        toast({
          title: "Success",
          description: "Snippet copied to clipboard",
        });
      } catch (e: any) {
        toast({
          title: "Error",
          description: e.message || "Failed to copy snippet.",
        });
      }
    }
  };

  const deleteCurrentSnippet = async () => {
    try {
      setDeleting(true);
      if (selectedSnippetId) {
        deleteSnippet(selectedSnippetId);
        setDeleteOpen(false);
        await loadSnippets(); // Use the local loadSnippets
        if (snippets.length === 1) {
          createNewSnippet();
        } else {
          if (snippets.length > 1) {
            loadSnippetInEditor(snippets[0].id);
          } else {
            createNewSnippet();
          }
        }
        toast({
          title: "Success",
          description: "Snippet deleted",
        });
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to delete snippet.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return {
    filename,
    setFilename,
    language,
    setLanguage,
    code,
    setCode,
    snippets,
    loading,
    saving,
    deleting,
    error,
    searchQuery,
    setSearchQuery,
    selectedSnippetId,
    setSelectedSnippetId,
    filteredSnippets,
    createNewSnippet,
    loadSnippetInEditor,
    saveCurrentSnippet,
    copySnippet,
    deleteCurrentSnippet,
    isDeleteOpen,
    setDeleteOpen,
  };
};
