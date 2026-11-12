CREATE TABLE IF NOT EXISTS session_plans (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Principale',
  location TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','completed','cancelled')),
  created_by TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS session_plans_date ON session_plans(date, status);

CREATE TABLE IF NOT EXISTS session_participation (
  session_id TEXT NOT NULL REFERENCES session_plans(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  availability TEXT NOT NULL DEFAULT 'pending' CHECK(availability IN ('pending','available','unavailable','maybe')),
  attendance TEXT NOT NULL DEFAULT 'pending' CHECK(attendance IN ('pending','present','absent','excused')),
  updated_at TEXT NOT NULL,
  PRIMARY KEY(session_id, player_id)
);
CREATE INDEX IF NOT EXISTS session_participation_player ON session_participation(player_id, session_id);

CREATE TABLE IF NOT EXISTS player_inspirations (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  granted_on TEXT NOT NULL,
  used_on TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS player_inspirations_player ON player_inspirations(player_id, granted_on DESC);
CREATE UNIQUE INDEX IF NOT EXISTS one_active_inspiration_per_player ON player_inspirations(player_id) WHERE used_on='';

CREATE TABLE IF NOT EXISTS player_items (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  session_date TEXT NOT NULL DEFAULT '',
  session_title TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS player_items_player ON player_items(player_id, created_at DESC);

