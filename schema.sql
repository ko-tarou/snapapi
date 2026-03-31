CREATE TABLE IF NOT EXISTS endpoints (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint_id TEXT NOT NULL,
  method TEXT NOT NULL,
  headers TEXT NOT NULL,
  body TEXT NOT NULL,
  received_at TEXT DEFAULT (datetime('now'))
);
