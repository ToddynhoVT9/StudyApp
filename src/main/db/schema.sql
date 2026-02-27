-- src/main/db/schema.sql
-- Executado na inicialização do app para garantir que as tabelas existam.

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ─── Blocos do currículo (8 blocos pré-carregados via seed) ──────
CREATE TABLE IF NOT EXISTS blocks (
  id          INTEGER PRIMARY KEY,
  title       TEXT    NOT NULL,
  order_index INTEGER NOT NULL UNIQUE,
  duration    TEXT,
  description TEXT
);

-- ─── Pontos do roadmap (etapas dentro de cada bloco) ─────────────
CREATE TABLE IF NOT EXISTS roadmap_points (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  block_id    INTEGER NOT NULL REFERENCES blocks(id),
  title       TEXT    NOT NULL,
  order_index INTEGER NOT NULL,
  weeks       TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending'
                CHECK(status IN ('pending','in_progress','done')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Notas do usuário (uma por ponto) ────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id    INTEGER NOT NULL REFERENCES roadmap_points(id) ON DELETE CASCADE,
  content     TEXT    NOT NULL DEFAULT '',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_point ON notes(point_id);

-- ─── Materiais de estudo vinculados a um ponto ───────────────────
CREATE TABLE IF NOT EXISTS studies (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id    INTEGER NOT NULL REFERENCES roadmap_points(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL,
  url         TEXT,
  type        TEXT    NOT NULL DEFAULT 'text'
                CHECK(type IN ('text','link','video','book')),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Atividades / exercícios vinculados a um ponto ───────────────
CREATE TABLE IF NOT EXISTS activities (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id    INTEGER NOT NULL REFERENCES roadmap_points(id) ON DELETE CASCADE,
  description TEXT    NOT NULL,
  done        INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  done_at     TEXT
);
