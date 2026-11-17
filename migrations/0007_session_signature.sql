-- Firma delle sessioni: si conserva l'account che ha inserito ogni voce XP,
-- così la sessione mostra chi l'ha registrata.
ALTER TABLE xp_entries ADD COLUMN created_by TEXT NOT NULL DEFAULT '';
ALTER TABLE xp_entry_trash ADD COLUMN created_by TEXT NOT NULL DEFAULT '';
