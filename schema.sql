CREATE TABLE IF NOT EXISTS endpoints (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);
