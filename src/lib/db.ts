import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const GLOBAL_KEY = "__snapapi_db";

function cleanupExpiredEndpoints(db: Database.Database): void {
  db.prepare("DELETE FROM endpoints WHERE expires_at IS NOT NULL AND expires_at < datetime('now')").run();
}

export function getDb(): Database.Database {
  const cached = (globalThis as Record<string, unknown>)[GLOBAL_KEY] as Database.Database | undefined;
  if (cached) return cached;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "snapapi.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS endpoints (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT
    )
  `);

  cleanupExpiredEndpoints(db);
  (globalThis as Record<string, unknown>)[GLOBAL_KEY] = db;

  return db;
}

export function createEndpoint(id: string, data: string): void {
  const stmt = getDb().prepare(
    "INSERT INTO endpoints (id, data, expires_at) VALUES (?, ?, datetime('now', '+24 hours'))"
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

export function withTransaction<T>(fn: () => T): T {
  const db = getDb();
  const transaction = db.transaction(fn);
  return transaction();
}
