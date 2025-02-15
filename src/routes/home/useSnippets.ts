import previewLanguages from "@/assets/previewLanguages.json";
import supportedLanguages from "@/assets/supportedLanguages.json";
import {
  deleteSnippet,
  getAllSnippets,
  getSnippet,
  saveSnippet,
  Snippet,
} from "@/utils/database";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPreviewable, setIsPreviewable] = useState(false);
  const [deletingSnippetId, setDeletingSnippetId] = useState<string | null>(
    null,
  );

  // Use a ref to store the currently loaded snippet.
  const currentSnippet = useRef<Snippet | null>(null);

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    loadSnippets();
  }, []);

  useEffect(() => {
    // Update isPreviewable when the language changes
    setIsPreviewable(
      !!language && previewLanguages.some((l) => l.id === language.id),
    );

    // Hide preview if language is not previewable
    if (!language || !previewLanguages.some((l) => l.id === language.id)) {
      setIsPreviewing(false);
    }
  }, [language]);

  const loadSnippets = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSnippets = await getAllSnippets();
      setSnippets(loadedSnippets);

      if (loadedSnippets.length > 0) {
        // Load the first snippet only if no snippet is currently selected.
        if (!selectedSnippetId) {
          loadSnippetInEditor(loadedSnippets[0].id);
        } else {
          // Ensure the editor is updated with the selected snippet if it exists after loading
          const selectedSnippet = loadedSnippets.find(
            (s) => s.id === selectedSnippetId,
          );
          if (selectedSnippet) {
            loadSnippetInEditor(selectedSnippet.id);
          } else {
            // If the selected snippet no longer exists, load the first snippet
            loadSnippetInEditor(loadedSnippets[0].id);
          }
        }
      } else {
        createNewSnippet();
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
    currentSnippet.current = null; // Clear the current snippet
    setIsPreviewing(false);
    setIsPreviewable(
      !!language && previewLanguages.some((l) => l.id === language.id),
    );
  };

  const loadSnippetInEditor = async (id: string) => {
    const snippet = await getSnippet(id);
    if (snippet) {
      setFilename(snippet.filename);
      setLanguage(
        supportedLanguages.find((l) => l.id === snippet.language) as Language,
      );
      setCode(snippet.code);
      setSelectedSnippetId(snippet.id);
      currentSnippet.current = snippet; // Set the current snippet
      setIsPreviewable(
        !!language && previewLanguages.some((l) => l.id === snippet.language),
      );
    }
  };

  const saveCurrentSnippet = async () => {
    try {
      setSaving(true);
      if (!language) {
        toast.error("Please select a language.");
        return;
      }

      if (!filename || filename.trim() === "") {
        toast.error("Filename cannot be empty.");
        return;
      }

      if (filename.length > 1024) {
        toast.error("Filename cannot be longer than 1024 characters.");
        return;
      }

      let snippetToSave: Snippet;

      if (selectedSnippetId) {
        // If a snippet is selected, update it
        snippetToSave = {
          id: selectedSnippetId,
          filename,
          language: language.id,
          code,
        };
      } else {
        // If no snippet is selected, create a new one
        snippetToSave = {
          id: uuidv4(),
          filename,
          language: language.id,
          code,
        };
        setSelectedSnippetId(snippetToSave.id); // Update selected id
      }

      await saveSnippet(snippetToSave);
      currentSnippet.current = snippetToSave; // Update current snippet reference.

      // After saving the snippet, load it in the editor.
      // Preserve the current previewing state

      loadSnippetInEditor(snippetToSave.id);

      // await loadSnippets();  //REMOVE THIS.  Loading all the snippets then immediately reloading the saved one is inefficient and unnecessary.
      setSnippets((prevSnippets) => {
        const existingIndex = prevSnippets.findIndex(
          (s) => s.id === snippetToSave.id,
        );
        if (existingIndex > -1) {
          // Update existing snippet
          const newSnippets = [...prevSnippets];
          newSnippets[existingIndex] = snippetToSave;
          return newSnippets;
        } else {
          // Add new snippet
          return [...prevSnippets, snippetToSave];
        }
      }); // Keep the snippets state in sync. A better approach would be to update the local snippets state by either adding a new snippet or updating the existing one.

      toast.success("Snippet saved");
    } catch (e: any) {
      toast.error("Failed to save snippet.");
    } finally {
      setSaving(false);
    }
  };

  const copySnippet = async (snippetId: string) => {
    const snippet = await getSnippet(snippetId);
    if (snippet) {
      try {
        await navigator.clipboard.writeText(snippet.code);
        toast.success("Snippet copied to clipboard");
      } catch (e: any) {
        toast.error("Failed to copy snippet.");
      }
    }
  };

  const deleteCurrentSnippet = async () => {
    try {
      setDeleting(true);
      if (deletingSnippetId) {
        await deleteSnippet(deletingSnippetId);
        setDeleteOpen(false);

        // Update snippets state after deletion
        setSnippets((prevSnippets) =>
          prevSnippets.filter((s) => s.id !== deletingSnippetId),
        );

        // Clear the deleting snippet id.
        const justDeletedSnippetId = deletingSnippetId;
        setDeletingSnippetId(null); // Clear the deleting snippet id

        const newSnippets = snippets.filter(
          (s) => s.id !== justDeletedSnippetId,
        );

        if (selectedSnippetId === justDeletedSnippetId) {
          // If the deleted snippet was currently selected, load another snippet
          if (newSnippets.length > 0) {
            loadSnippetInEditor(newSnippets[0].id);
          } else {
            createNewSnippet();
          }
        }

        toast.success("Snippet deleted");
      }
    } catch (e: any) {
      toast.error("Failed to delete snippet.");
    } finally {
      setDeleting(false);
    }
  };

  const togglePreview = () => {
    setIsPreviewing((prev) => !prev);
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
    isPreviewable,
    isPreviewing,
    togglePreview,
    deletingSnippetId,
    setDeletingSnippetId,
  };
};
