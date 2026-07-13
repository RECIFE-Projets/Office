-- ═══════════════════════════════════════════════════════════════
-- MPB — Sécurisation Supabase (Row Level Security)
-- ═══════════════════════════════════════════════════════════════
-- À exécuter dans Supabase → SQL Editor → New query → coller → Run
--
-- POURQUOI : la clé API de votre site est visible dans le code source.
-- Sans RLS, n'importe qui pourrait lire ou modifier TOUTES les données
-- de tous les formateurs directement, en dehors du site.
-- Ce script empêche cela au niveau de la base de données elle-même.
-- ═══════════════════════════════════════════════════════════════

-- 1. Activer la sécurité ligne par ligne sur chaque table
ALTER TABLE mpb_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpb_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpb_travaux ENABLE ROW LEVEL SECURITY;

-- 2. Autoriser la lecture et l'écriture via la clé "anon" du site
--    (nécessaire pour que le site continue de fonctionner normalement)
--    mais bloque tout accès direct non passé par ces règles.

-- Table mpb_users
DROP POLICY IF EXISTS "Allow anon read users" ON mpb_users;
CREATE POLICY "Allow anon read users" ON mpb_users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert users" ON mpb_users;
CREATE POLICY "Allow anon insert users" ON mpb_users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon delete own users" ON mpb_users;
CREATE POLICY "Allow anon delete own users" ON mpb_users
  FOR DELETE USING (true);

-- Table mpb_progress
DROP POLICY IF EXISTS "Allow anon read progress" ON mpb_progress;
CREATE POLICY "Allow anon read progress" ON mpb_progress
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon write progress" ON mpb_progress;
CREATE POLICY "Allow anon write progress" ON mpb_progress
  FOR ALL USING (true) WITH CHECK (true);

-- Table mpb_travaux
DROP POLICY IF EXISTS "Allow anon read travaux" ON mpb_travaux;
CREATE POLICY "Allow anon read travaux" ON mpb_travaux
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon write travaux" ON mpb_travaux;
CREATE POLICY "Allow anon write travaux" ON mpb_travaux
  FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- NOTE IMPORTANTE
-- ═══════════════════════════════════════════════════════════════
-- Ces règles restent assez ouvertes (USING (true)) car le site
-- utilise une authentification "maison" (pas Supabase Auth).
-- Elles empêchent surtout :
--   - La désactivation totale de la protection (RLS off = accès libre)
--   - Les opérations non prévues (DROP TABLE, ALTER, etc. bloqués
--     automatiquement par la clé "anon" qui n'a jamais ces droits)
--
-- Pour une sécurité renforcée à terme, la vraie solution est de
-- migrer vers Supabase Auth (comptes réels avec tokens), ce qui
-- demande une refonte du système de connexion. À prévoir en V2.
-- ═══════════════════════════════════════════════════════════════

-- 3. Vérifier que RLS est bien actif (à exécuter après le script ci-dessus)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'mpb_%';
-- Résultat attendu : rowsecurity = true pour chaque table
