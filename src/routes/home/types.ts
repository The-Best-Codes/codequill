import { Snippet } from "@/utils/database";

export interface Language {
  id: string;
  name: string;
  shortName: string;
  files: string[];
}

export interface UseSnippetsReturn {
  filename: string;
  setFilename: React.Dispatch<React.SetStateAction<string>>;
  language: Language | null;
  setLanguage: React.Dispatch<React.SetStateAction<Language | null>>;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  snippets: Snippet[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedSnippetId: string | null;
  setSelectedSnippetId: React.Dispatch<React.SetStateAction<string | null>>;
  filteredSnippets: Snippet[];
  createNewSnippet: () => void;
  loadSnippetInEditor: (id: string) => void;
  saveCurrentSnippet: () => Promise<void>;
  copySnippet: (snippetId: string) => Promise<void>;
  deleteCurrentSnippet: () => Promise<void>;
  isDeleteOpen: boolean;
  setDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
