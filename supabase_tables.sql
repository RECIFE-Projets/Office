-- ═══════════════════════════════════════════════════════════
-- TABLES MA PLATEFORME BUREAUTIQUE — Supabase
-- À exécuter dans : Supabase → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- TABLE 1 : Progression des stagiaires
CREATE TABLE IF NOT EXISTS mpb_progress (
  user_hash   TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  progress    JSONB DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 2 : Utilisateurs inscrits (partagés entre formateurs)
CREATE TABLE IF NOT EXISTS mpb_users (
  email_hash  TEXT PRIMARY KEY,
  prenom      TEXT,
  nom         TEXT,
  role        TEXT DEFAULT 'stagiaire',
  groupe      TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 3 : Messages stagiaires → formateurs
CREATE TABLE IF NOT EXISTS mpb_messages (
  id          BIGSERIAL PRIMARY KEY,
  from_hash   TEXT,
  from_name   TEXT,
  to_role     TEXT DEFAULT 'formateur',
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  read        BOOLEAN DEFAULT FALSE
);

-- ═══════════════════════════════════════════════════════════
-- SÉCURITÉ : Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════

-- Activer RLS sur toutes les tables
ALTER TABLE mpb_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpb_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpb_messages ENABLE ROW LEVEL SECURITY;

-- Politique : lecture et écriture pour tous (clé anon)
-- (la sécurité est gérée par le hash email côté application)

CREATE POLICY "allow_all_progress" ON mpb_progress
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_users" ON mpb_users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_messages" ON mpb_messages
  FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- INDEX pour les performances
-- ═══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_progress_email    ON mpb_progress(email);
CREATE INDEX IF NOT EXISTS idx_progress_updated  ON mpb_progress(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_role        ON mpb_users(role);
CREATE INDEX IF NOT EXISTS idx_messages_created  ON mpb_messages(created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- TEST : insérer une ligne de test puis la supprimer
-- ═══════════════════════════════════════════════════════════
INSERT INTO mpb_progress (user_hash, email, progress)
VALUES ('test_hash', 'test@test.fr', '{"test": true}')
ON CONFLICT (user_hash) DO NOTHING;

SELECT * FROM mpb_progress WHERE user_hash = 'test_hash';

DELETE FROM mpb_progress WHERE user_hash = 'test_hash';

-- Si vous voyez "DELETE 1" → les tables fonctionnent ✅
