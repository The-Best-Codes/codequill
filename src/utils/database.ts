import Database from "@tauri-apps/plugin-sql";

export interface Snippet {
  id: string;
  filename: string;
  language: string;
  code: string;
  created_at?: string;
}

const DB_PATH = "sqlite:codequill.db";

let db: Database | null = null;

const initializeDatabase = async (): Promise<Database> => {
  if (db) {
    return db;
  }
  db = await Database.load(DB_PATH);

  // Create the snippets table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS snippets (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      language TEXT NOT NULL,
      code TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
};

export const getAllSnippets = async (): Promise<Snippet[]> => {
  const dbInstance = await initializeDatabase();
  const result = await dbInstance.select<Snippet[]>(
    "SELECT * FROM snippets ORDER BY created_at DESC",
  );
  return result;
};

export const getSnippet = async (id: string): Promise<Snippet | undefined> => {
  const dbInstance = await initializeDatabase();
  const result = await dbInstance.select<Snippet[]>(
    "SELECT * FROM snippets WHERE id = ?",
    [id],
  );
  return result.length > 0 ? result[0] : undefined;
};

export const saveSnippet = async (snippet: Snippet) => {
  const dbInstance = await initializeDatabase();

  try {
    await dbInstance.execute(
      `INSERT OR REPLACE INTO snippets (id, filename, language, code) VALUES (?, ?, ?, ?)`,
      [snippet.id, snippet.filename, snippet.language, snippet.code],
    );
  } catch (error) {
    console.error("Error saving snippet:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const deleteSnippet = async (id: string) => {
  const dbInstance = await initializeDatabase();
  try {
    await dbInstance.execute("DELETE FROM snippets WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting snippet:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
