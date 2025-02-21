import Database from "@tauri-apps/plugin-sql";
import { runMigrations } from "./db/migrators";

export interface Snippet {
  id: string;
  filename: string;
  language: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

const DB_PATH = "sqlite:codequill.db";

let db: Database | null = null;

const initializeDatabase = async (
  retryCount: number = 0,
): Promise<Database> => {
  if (db) {
    return db;
  }

  if (retryCount >= 3) {
    throw new Error("Failed to initialize database after multiple retries.");
  }

  try {
    db = await Database.load(DB_PATH);

    // Run database migrations
    await runMigrations(db);

    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    console.log(
      `Retrying database initialization (attempt ${retryCount + 1}) in 1 second...`,
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return initializeDatabase(retryCount + 1); // Recursive call to retry with incremented counter.
  }
};

export const getAllSnippets = async (): Promise<Snippet[]> => {
  const dbInstance = await initializeDatabase();
  const result = await dbInstance.select<Snippet[]>(
    "SELECT * FROM snippets ORDER BY updated_at DESC",
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
    // Check if the snippet already exists
    const existingSnippet = await getSnippet(snippet.id);

    if (existingSnippet) {
      // Update the existing snippet
      await dbInstance.execute(
        `UPDATE snippets SET filename = ?, language = ?, code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [snippet.filename, snippet.language, snippet.code, snippet.id],
      );
    } else {
      // Insert a new snippet
      await dbInstance.execute(
        `INSERT INTO snippets (id, filename, language, code) VALUES (?, ?, ?, ?)`,
        [snippet.id, snippet.filename, snippet.language, snippet.code],
      );
    }
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
