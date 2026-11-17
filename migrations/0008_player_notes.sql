-- Note dei master sui singoli PG: azioni compiute e possibili risvolti nel mondo di gioco.
CREATE TABLE IF NOT EXISTS player_notes (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS player_notes_player ON player_notes(player_id, created_at DESC);
