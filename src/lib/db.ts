import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "snapapi.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS endpoints (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT
    )
  `);

  return db;
}

export function createEndpoint(id: string, data: string): void {
  const stmt = getDb().prepare(
    "INSERT INTO endpoints (id, data) VALUES (?, ?)"
  );
  stmt.run(id, data);
}

export function getEndpoint(
  id: string
): { id: string; data: string; created_at: string; expires_at: string | null } | undefined {
  const stmt = getDb().prepare("SELECT * FROM endpoints WHERE id = ?");
  return stmt.get(id) as
    | { id: string; data: string; created_at: string; expires_at: string | null }
    | undefined;
}

export function updateEndpointData(id: string, data: string): void {
  const stmt = getDb().prepare("UPDATE endpoints SET data = ? WHERE id = ?");
  stmt.run(data, id);
}
