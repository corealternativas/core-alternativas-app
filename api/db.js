import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
})

export function query(text, params) {
  return pool.query(text, params)
}

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email          TEXT UNIQUE NOT NULL,
      password_hash  TEXT NOT NULL,
      name           TEXT,
      role           TEXT NOT NULL DEFAULT 'user',
      active         BOOLEAN NOT NULL DEFAULT true,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_login_at  TIMESTAMPTZ
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token       TEXT UNIQUE NOT NULL,
      expires_at  TIMESTAMPTZ NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculations (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      cells       JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_calculations_user ON calculations(user_id)`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS style_test_submissions (
      id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre              TEXT,
      apellido            TEXT,
      email               TEXT,
      genero              TEXT,
      ubicacion           TEXT,
      ip_location         TEXT,
      place               TEXT,
      fit                 TEXT,
      personalidad        JSONB NOT NULL DEFAULT '[]'::jsonb,
      caracteristicas     TEXT,
      tiempo              TEXT,
      sugerencia          TEXT,
      results             JSONB NOT NULL DEFAULT '[]'::jsonb,
      comunicaciones      BOOLEAN NOT NULL DEFAULT false,
      procesamiento       BOOLEAN NOT NULL DEFAULT false,
      payload             JSONB NOT NULL DEFAULT '{}'::jsonb,
      email_message_id    TEXT,
      notion_saved        BOOLEAN NOT NULL DEFAULT false,
      notion_error        TEXT,
      source              TEXT NOT NULL DEFAULT 'app',
      submitted_at        TIMESTAMPTZ,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  // Idempotent column additions for pre-existing deployments.
  await pool.query(`ALTER TABLE style_test_submissions ADD COLUMN IF NOT EXISTS place TEXT`)
  await pool.query(`ALTER TABLE style_test_submissions ADD COLUMN IF NOT EXISTS fit TEXT`)
  await pool.query(`ALTER TABLE style_test_submissions ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'app'`)
  await pool.query(`ALTER TABLE style_test_submissions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ`)

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_style_test_email ON style_test_submissions(email)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_style_test_created_at ON style_test_submissions(created_at DESC)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_style_test_submitted_at ON style_test_submissions(submitted_at DESC)`)

  // Dedupe guard for the historical Notion import: (email, submitted_at) is unique when both are present.
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS uniq_style_test_email_submitted_at
    ON style_test_submissions (email, submitted_at)
    WHERE email IS NOT NULL AND submitted_at IS NOT NULL
  `)
}
