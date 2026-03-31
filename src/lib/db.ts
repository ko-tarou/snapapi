import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Database = {
  prepare(sql: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
};

type D1Result<T = unknown> = {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
};

export async function getDb(): Promise<D1Database> {
  const { env } = await getCloudflareContext();
  return (env as Record<string, unknown>).DB as D1Database;
}

export async function initDb(): Promise<void> {
  const db = await getDb();
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS endpoints (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        expires_at TEXT
      )`
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS webhook_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_id TEXT NOT NULL,
        method TEXT NOT NULL,
        headers TEXT NOT NULL,
        body TEXT NOT NULL,
        received_at TEXT DEFAULT (datetime('now'))
      )`
    ),
  ]);
}

export async function cleanupExpiredEndpoints(): Promise<void> {
  const db = await getDb();
  await db
    .prepare(
      "DELETE FROM endpoints WHERE expires_at IS NOT NULL AND expires_at < datetime('now')"
    )
    .run();
}

export async function createEndpoint(id: string, data: string): Promise<void> {
  const db = await getDb();
  await db
    .prepare(
      "INSERT INTO endpoints (id, data, expires_at) VALUES (?, ?, datetime('now', '+24 hours'))"
    )
    .bind(id, data)
    .run();
}

export async function getEndpoint(
  id: string
): Promise<{
  id: string;
  data: string;
  created_at: string;
  expires_at: string | null;
} | null> {
  const db = await getDb();
  return db
    .prepare("SELECT * FROM endpoints WHERE id = ?")
    .bind(id)
    .first<{
      id: string;
      data: string;
      created_at: string;
      expires_at: string | null;
    }>();
}

export async function updateEndpointData(
  id: string,
  data: string
): Promise<void> {
  const db = await getDb();
  await db
    .prepare("UPDATE endpoints SET data = ? WHERE id = ?")
    .bind(data, id)
    .run();
}

export async function addWebhookLog(
  endpointId: string,
  method: string,
  headers: string,
  body: string
): Promise<void> {
  const db = await getDb();
  await db
    .prepare(
      "INSERT INTO webhook_logs (endpoint_id, method, headers, body) VALUES (?, ?, ?, ?)"
    )
    .bind(endpointId, method, headers, body)
    .run();
}

export async function getWebhookLogs(
  endpointId: string
): Promise<
  {
    id: number;
    endpoint_id: string;
    method: string;
    headers: string;
    body: string;
    received_at: string;
  }[]
> {
  const db = await getDb();
  const result = await db
    .prepare(
      "SELECT * FROM webhook_logs WHERE endpoint_id = ? ORDER BY id DESC LIMIT 50"
    )
    .bind(endpointId)
    .all<{
      id: number;
      endpoint_id: string;
      method: string;
      headers: string;
      body: string;
      received_at: string;
    }>();
  return result.results;
}

export async function clearWebhookLogs(
  endpointId: string
): Promise<void> {
  const db = await getDb();
  await db
    .prepare("DELETE FROM webhook_logs WHERE endpoint_id = ?")
    .bind(endpointId)
    .run();
}
