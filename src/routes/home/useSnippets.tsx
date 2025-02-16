import previewLanguages from "@/assets/previewLanguages.json";
import supportedLanguages from "@/assets/supportedLanguages.json";
import { getDefaultLanguage } from "@/utils/config";
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

const getPreviewStateKey = (snippetId: string) =>
  `codequill_preview_state_${snippetId}`;

const SELECTED_SNIPPET_ID_KEY = "codequill_selected_snippet_id";
const FILENAME_KEY = "codequill_filename";
const LANGUAGE_KEY = "codequill_language";
const CODE_KEY = "codequill_code";

const showErrorToast = (message: string, details?: string) => {
  toast.error(
    <div className="w-full max-h-full overflow-auto">
      <p>{message}</p>
      {details && (
        <pre className="font-mono text-xs whitespace-pre-wrap">{details}</pre>
      )}
    </div>,
    {
      duration: Infinity,
      closeButton: true,
    },
  );
};

export const useSnippets = (): Omit<
  UseSnippetsReturn,
  "searchQuery" | "setSearchQuery"
> => {
  const [filename, setFilename] = useState<string>(() => {
    if (typeof window === "undefined") return "Untitled";
    return sessionStorage.getItem(FILENAME_KEY) || "Untitled";
  });
  const [language, setLanguage] = useState<Language | null>(() => {
    if (typeof window === "undefined") return getDefaultLanguage();

    try {
      const storedLanguage = sessionStorage.getItem(LANGUAGE_KEY);
      return storedLanguage
        ? (JSON.parse(storedLanguage) as Language)
        : getDefaultLanguage();
    } catch (error) {
      console.error(error);
      return getDefaultLanguage();
    }
  });
  const [code, setCode] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(CODE_KEY) || "";
  });

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // @ts-ignore
  const [saving, setSaving] = useState<boolean>(false);
  // @ts-ignore
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(
    () => {
      if (typeof window === "undefined") return null;
      return sessionStorage.getItem(SELECTED_SNIPPET_ID_KEY) || null;
    },
  );

  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // Initialize from session storage
  const [isPreviewing, setIsPreviewing] = useState<boolean>(() => {
    if (typeof window === "undefined" || !selectedSnippetId) return false; // SSR
    try {
      const key = getPreviewStateKey(selectedSnippetId);
      const storedState = sessionStorage.getItem(key);
      return storedState ? JSON.parse(storedState) : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  const [isPreviewable, setIsPreviewable] = useState(false);
  const [deletingSnippetId, setDeletingSnippetId] = useState<string | null>(
    null,
  );

  // Use a ref to store the currently loaded snippet.
  const currentSnippet = useRef<Snippet | null>(null);

  const filteredSnippets = snippets;

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

  // Update session storage whenever isPreviewing or selectedSnippetId changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && selectedSnippetId) {
        const key = getPreviewStateKey(selectedSnippetId);
        sessionStorage.setItem(key, JSON.stringify(isPreviewing));
      }
    } catch (error) {
      console.error("Error updating session storage:", error);
    }
  }, [isPreviewing, selectedSnippetId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(FILENAME_KEY, filename);
    }
  }, [filename]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(LANGUAGE_KEY, JSON.stringify(language));
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CODE_KEY, code);
    }
  }, [code]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SELECTED_SNIPPET_ID_KEY, selectedSnippetId || "");
    }
  }, [selectedSnippetId]);

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
      showErrorToast("Failed to load snippets.", e.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewSnippet = () => {
    setFilename("Untitled");
    setLanguage(getDefaultLanguage());
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

      if (typeof window !== "undefined") {
        try {
          const key = getPreviewStateKey(id);
          const storedState = sessionStorage.getItem(key);
          setIsPreviewing(storedState ? JSON.parse(storedState) : false);
        } catch (error) {
          console.error(
            "Failed to load preview state from localStorage:",
            error,
          );
          showErrorToast(
            "Failed to load preview state from localStorage.",
            String(error),
          );
        }
      }
    }
  };

  const saveCurrentSnippet = async () => {
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

    const savePromise = async () => {
      await saveSnippet(snippetToSave);
      currentSnippet.current = snippetToSave; // Update current snippet reference.

      loadSnippetInEditor(snippetToSave.id);

      setSnippets((prevSnippets) => {
        const existingIndex = prevSnippets.findIndex(
          (s) => s.id === snippetToSave.id,
        );

        if (existingIndex > -1) {
          // Update existing snippet AND move to top
          const updatedSnippets = [...prevSnippets];
          updatedSnippets[existingIndex] = snippetToSave; // Update the existing one

          // Remove the updated snippet from its old position and insert at the beginning
          updatedSnippets.splice(existingIndex, 1);
          updatedSnippets.unshift(snippetToSave);
          return updatedSnippets;
        } else {
          // Add new snippet to the beginning of the array
          return [snippetToSave, ...prevSnippets];
        }
      });
      return "Snippet saved successfully!";
    };

    toast.promise(savePromise(), {
      loading: "Saving snippet...",
      success: (message) => message,
      error: "Failed to save snippet.",
    });
  };

  const copySnippet = async (snippetId: string) => {
    const snippet = await getSnippet(snippetId);
    if (snippet) {
      try {
        await navigator.clipboard.writeText(snippet.code);
        toast.success("Snippet copied to clipboard");
      } catch (e: any) {
        showErrorToast("Failed to copy snippet.", e.message);
      }
    }
  };

  const deleteCurrentSnippet = async () => {
    if (!deletingSnippetId) return;

    const deletePromise = async () => {
      await deleteSnippet(deletingSnippetId);
      setDeleteOpen(false);

      setSnippets((prevSnippets) =>
        prevSnippets.filter((s) => s.id !== deletingSnippetId),
      );

      // Remove the preview from localStorage
      if (typeof window !== "undefined") {
        try {
          const key = getPreviewStateKey(deletingSnippetId);
          sessionStorage.removeItem(key);
        } catch (error) {
          console.error("Failed to remove preview from localStorage:", error);
          showErrorToast(
            "Failed to remove preview from localStorage.",
            String(error),
          );
        }
      }

      const justDeletedSnippetId = deletingSnippetId;
      setDeletingSnippetId(null);

      const newSnippets = snippets.filter((s) => s.id !== justDeletedSnippetId);

      if (selectedSnippetId === justDeletedSnippetId) {
        if (newSnippets.length > 0) {
          loadSnippetInEditor(newSnippets[0].id);
        } else {
          createNewSnippet();
        }
      }
      return "Snippet deleted successfully!";
    };

    toast.promise(deletePromise(), {
      loading: "Deleting snippet...",
      success: (message) => message,
      error: "Failed to delete snippet.",
    });
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
