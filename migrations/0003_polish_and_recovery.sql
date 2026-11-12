ALTER TABLE users ADD COLUMN last_login TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS xp_entry_trash (
  id TEXT PRIMARY KEY,
  player_id TEXT,
  player_name TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  deleted_by TEXT NOT NULL,
  deleted_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS xp_entry_trash_deleted ON xp_entry_trash(deleted_at DESC);

