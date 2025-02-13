export interface Snippet {
  id: string;
  filename: string;
  language: string;
  code: string;
}

const SNIPPET_STORAGE_KEY = "codeQuillSnippets";

export const getAllSnippets = (): Snippet[] => {
  const snippetsString = localStorage.getItem(SNIPPET_STORAGE_KEY);
  return snippetsString ? JSON.parse(snippetsString) : [];
};

export const getSnippet = (id: string): Snippet | undefined => {
  const snippets = getAllSnippets();
  return snippets.find((snippet) => snippet.id === id);
};

export const saveSnippet = (snippet: Snippet) => {
  const snippets = getAllSnippets();
  const existingIndex = snippets.findIndex((s) => s.id === snippet.id);

  if (existingIndex > -1) {
    snippets[existingIndex] = snippet; // Update existing
  } else {
    snippets.push(snippet); // Create new
  }

  localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(snippets));
};

export const deleteSnippet = (id: string) => {
  let snippets = getAllSnippets();
  snippets = snippets.filter((s) => s.id !== id);
  localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(snippets));
};
