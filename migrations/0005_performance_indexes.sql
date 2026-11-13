-- Indici per le query usate da login, audit e pulizia delle sessioni.
CREATE INDEX IF NOT EXISTS sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS login_attempts_ip_time ON login_attempts(ip, attempted_at);
CREATE INDEX IF NOT EXISTS audit_log_action_time ON audit_log(action, created_at DESC);
