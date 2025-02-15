export interface Snippet {
  id: string;
  filename: string;
  language: string;
  code: string;
}

const SNIPPET_STORAGE_KEY = "codeQuillSnippets";

const simulateLoading = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 0); // Simulate X milliseconds loading time
  });
};

export const getAllSnippets = async (): Promise<Snippet[]> => {
  await simulateLoading();
  const snippetsString = localStorage.getItem(SNIPPET_STORAGE_KEY);
  return snippetsString ? JSON.parse(snippetsString) : [];
};

export const getSnippet = async (id: string): Promise<Snippet | undefined> => {
  await simulateLoading();
  const snippets = await getAllSnippets();
  return snippets.find((snippet) => snippet.id === id);
};

export const saveSnippet = async (snippet: Snippet) => {
  await simulateLoading();
  const snippets = await getAllSnippets();
  const existingIndex = snippets.findIndex((s) => s.id === snippet.id);

  if (existingIndex > -1) {
    snippets[existingIndex] = snippet; // Update existing
  } else {
    snippets.push(snippet); // Create new
  }

  localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(snippets));
};

export const deleteSnippet = async (id: string) => {
  await simulateLoading();
  let snippets = await getAllSnippets();
  snippets = snippets.filter((s) => s.id !== id);
  localStorage.setItem(SNIPPET_STORAGE_KEY, JSON.stringify(snippets));
};
