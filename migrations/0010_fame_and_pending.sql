-- 0010: GP strutturati, resoconti in sospeso, registro della fama.
ALTER TABLE adventure_details ADD COLUMN gp_amount INTEGER NOT NULL DEFAULT 0;
ALTER TABLE adventure_details ADD COLUMN gp_per TEXT NOT NULL DEFAULT '';
ALTER TABLE adventure_trash ADD COLUMN gp_amount INTEGER NOT NULL DEFAULT 0;
ALTER TABLE adventure_trash ADD COLUMN gp_per TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS pending_reports(
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  players TEXT NOT NULL DEFAULT '',
  xp TEXT NOT NULL DEFAULT '',
  gp TEXT NOT NULL DEFAULT '',
  items TEXT NOT NULL DEFAULT '',
  fame TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'aperto',
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pending_status ON pending_reports(status, date);

CREATE TABLE IF NOT EXISTS fame_entries(
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  nation TEXT NOT NULL,
  player_id TEXT NOT NULL DEFAULT '',
  player_name TEXT NOT NULL DEFAULT '',
  delta INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fame_nation ON fame_entries(nation);
CREATE INDEX IF NOT EXISTS idx_fame_date ON fame_entries(date);
CREATE INDEX IF NOT EXISTS idx_fame_player ON fame_entries(player_id);
