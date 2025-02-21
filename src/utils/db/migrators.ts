import Database from "@tauri-apps/plugin-sql";

// Define the current database version
const LATEST_DB_VERSION = "1.0";

interface Migration {
  fromVersion: string | null;
  toVersion: string;
  migrate: (db: Database) => Promise<void>;
}

const migrations: Migration[] = [
  {
    fromVersion: null,
    toVersion: "1.0",
    migrate: async (db: Database) => {
      console.log("Migrating from scratch to version 1.0");
      await db.execute(`
        CREATE TABLE IF NOT EXISTS snippets (
          id TEXT PRIMARY KEY,
          filename TEXT NOT NULL,
          language TEXT NOT NULL,
          code TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS app_info (
          key TEXT PRIMARY KEY,
          version TEXT NOT NULL
        )
      `);
      await db.execute(
        "INSERT OR REPLACE INTO app_info (key, version) VALUES ('db_version', ?)",
        ["1.0"],
      );
      console.log("Migration to version 1.0 complete");
    },
  },
  {
    fromVersion: "0.0",
    toVersion: "1.0",
    migrate: async (db: Database) => {
      console.log("Migrating from version 0.0 to version 1.0");

      try {
        // Create a temporary table with the new schema
        await db.execute(`
          CREATE TABLE IF NOT EXISTS snippets_temp (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            language TEXT NOT NULL,
            code TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL
          )
        `);

        // Copy data from the old table to the temporary table
        await db.execute(`
          INSERT INTO snippets_temp (id, filename, language, code, created_at, updated_at)
          SELECT id, filename, language, code, created_at,
          CASE WHEN created_at IS NULL THEN CURRENT_TIMESTAMP ELSE created_at END
          FROM snippets
        `);

        // Drop the old table
        await db.execute(`DROP TABLE snippets`);

        // Rename the temporary table to the original table name
        await db.execute(`ALTER TABLE snippets_temp RENAME TO snippets`);

        console.log(
          "Successfully migrated snippets table to include updated_at column",
        );
      } catch (error: any) {
        console.error("Error migrating snippets table:", error);
        throw error;
      }

      // Create the 'app_info' table and set the database version to 1.0
      await db.execute(`
            CREATE TABLE IF NOT EXISTS app_info (
              key TEXT PRIMARY KEY,
              version TEXT NOT NULL
            )
          `);
      await db.execute(
        "INSERT OR REPLACE INTO app_info (key, version) VALUES ('db_version', ?)",
        ["1.0"],
      );

      console.log("Migration from version 0.0 to 1.0 complete");
    },
  },
];

async function getDatabaseVersion(db: Database): Promise<string | null> {
  try {
    const result = await db.select<{ version: string }[]>(
      "SELECT version FROM app_info WHERE key = 'db_version'",
    );
    if (result.length > 0) {
      return result[0].version;
    } else {
      throw new Error("app_info table not found");
    }
  } catch (error) {
    // Table probably doesn't exist. Check if snippets table exists, if so assume version 0.0
    try {
      await db.select("SELECT id FROM snippets LIMIT 1");
      console.log(
        "app_info table not found, but snippets table exists. Assuming version 0.0",
      );
      return "0.0";
    } catch (e) {
      // Neither table exists.
      return null;
    }
  }
}

async function setDatabaseVersion(
  db: Database,
  version: string,
): Promise<void> {
  try {
    await db.execute(
      "INSERT OR REPLACE INTO app_info (key, version) VALUES ('db_version', ?)",
      [version],
    );
  } catch (error) {
    console.error("Error setting database version:", error);
    throw error;
  }
}

async function applyMigrations(
  db: Database,
  currentVersion: string | null,
): Promise<void> {
  const sortedMigrations = migrations.sort((a, b) =>
    a.toVersion.localeCompare(b.toVersion),
  );

  for (const migration of sortedMigrations) {
    if (migration.fromVersion === currentVersion) {
      console.log(
        `Migrating from version ${migration.fromVersion ?? "scratch"} to version ${migration.toVersion}`,
      );
      try {
        await migration.migrate(db);
        await setDatabaseVersion(db, migration.toVersion);
        console.log(`Successfully migrated to version ${migration.toVersion}`);
        currentVersion = migration.toVersion; // Update currentVersion
      } catch (error) {
        console.error(
          `Failed to migrate to version ${migration.toVersion}:`,
          error,
        );
        throw error; // Stop if a migration fails.
      }
    }
  }

  if (currentVersion === null) {
    await setDatabaseVersion(db, LATEST_DB_VERSION);
  }
}

export async function runMigrations(db: Database): Promise<void> {
  try {
    const currentVersion = await getDatabaseVersion(db);
    await applyMigrations(db, currentVersion);
  } catch (error) {
    console.error("Error running database migrations:", error);
    throw error;
  }
}
