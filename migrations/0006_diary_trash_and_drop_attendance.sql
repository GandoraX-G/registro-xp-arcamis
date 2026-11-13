-- Cestino dei diari: eliminando una sessione il riassunto resta recuperabile.
CREATE TABLE IF NOT EXISTS adventure_trash (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  deleted_by TEXT NOT NULL,
  deleted_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS adventure_trash_deleted ON adventure_trash(deleted_at DESC);

-- Presenze: la disponibilità dei partecipanti resta (serve al calendario),
-- la marcatura presente/assente/giustificato viene eliminata insieme alla sezione.
CREATE TABLE session_participation_v2 (
  session_id TEXT NOT NULL REFERENCES session_plans(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  availability TEXT NOT NULL DEFAULT 'pending' CHECK(availability IN ('pending','available','unavailable','maybe')),
  updated_at TEXT NOT NULL,
  PRIMARY KEY(session_id, player_id)
);
INSERT INTO session_participation_v2(session_id,player_id,availability,updated_at)
  SELECT session_id,player_id,availability,updated_at FROM session_participation;
DROP TABLE session_participation;
ALTER TABLE session_participation_v2 RENAME TO session_participation;
CREATE INDEX IF NOT EXISTS session_participation_player ON session_participation(player_id, session_id);
