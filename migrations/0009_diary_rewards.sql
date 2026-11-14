-- 0009: ricompense del diario di sessione (GP, oggetti, note fama).
-- Colonne aggiunte anche al cestino, così un diario eliminato e recuperato non perde i dati.
ALTER TABLE adventure_details ADD COLUMN gp TEXT NOT NULL DEFAULT '';
ALTER TABLE adventure_details ADD COLUMN items TEXT NOT NULL DEFAULT '';
ALTER TABLE adventure_details ADD COLUMN fame TEXT NOT NULL DEFAULT '';
ALTER TABLE adventure_trash ADD COLUMN gp TEXT NOT NULL DEFAULT '';
ALTER TABLE adventure_trash ADD COLUMN items TEXT NOT NULL DEFAULT '';
ALTER TABLE adventure_trash ADD COLUMN fame TEXT NOT NULL DEFAULT '';
