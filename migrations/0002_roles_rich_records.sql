-- Introduce the three account roles while preserving active logins.
CREATE TABLE users_v2 (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','editor','viewer')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);
INSERT INTO users_v2 (id,username,password_hash,password_salt,role,active,created_at)
  SELECT id,username,password_hash,password_salt,
    CASE WHEN role='admin' THEN 'admin' ELSE 'viewer' END,
    active,created_at FROM users;
CREATE TABLE sessions_v2 (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users_v2(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);
INSERT INTO sessions_v2 (token_hash,user_id,expires_at)
  SELECT token_hash,user_id,expires_at FROM sessions;
DROP TABLE sessions;
DROP TABLE users;
ALTER TABLE users_v2 RENAME TO users;
ALTER TABLE sessions_v2 RENAME TO sessions;

ALTER TABLE players ADD COLUMN level TEXT NOT NULL DEFAULT '';
ALTER TABLE players ADD COLUMN background TEXT NOT NULL DEFAULT '';
ALTER TABLE players ADD COLUMN alignment TEXT NOT NULL DEFAULT '';
ALTER TABLE players ADD COLUMN status TEXT NOT NULL DEFAULT 'Attivo';
ALTER TABLE players ADD COLUMN birthday TEXT NOT NULL DEFAULT '';
ALTER TABLE players ADD COLUMN portrait_url TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS adventure_details (
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  updated_by TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  PRIMARY KEY(date,type,title)
);
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS audit_log_created ON audit_log(created_at DESC);

