#!/usr/bin/env node
// One-off importer: load historical Style Test submissions from the Notion CSV
// export into the `style_test_submissions` table.
//
// Usage:
//   DATABASE_URL=postgres://... node scripts/import-style-test-csv.mjs <path-to-csv> [--dry-run]
//
// Behavior:
//   - Dedupes rows with the same (email, submitted_at) pair (idempotent re-runs).
//   - Rows missing both email and date are skipped.
//   - --dry-run prints what would be inserted without touching the DB.

import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import pg from 'pg'
import { initDb } from '../api/db.js'

const { Pool } = pg

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const csvPath = args.find((a) => !a.startsWith('--'))

if (!csvPath) {
  console.error('Usage: node scripts/import-style-test-csv.mjs <path-to-csv> [--dry-run]')
  process.exit(1)
}
if (!fs.existsSync(csvPath)) {
  console.error(`CSV not found: ${csvPath}`)
  process.exit(1)
}
if (!dryRun && !process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required (unless --dry-run).')
  process.exit(1)
}

// --- Field helpers ---------------------------------------------------------

const GENDER_SET = new Set(['mujer', 'hombre', 'no-binario', 'otro', 'prefiero-no-decir'])

const normalizeGender = (raw) => {
  const v = String(raw || '').trim().toLowerCase()
  return GENDER_SET.has(v) ? v : null
}

const yesNo = (raw) => {
  const v = String(raw || '').trim().toLowerCase()
  return v === 'yes' || v === 'si' || v === 'sí' || v === 'true'
}

const trimOrNull = (raw) => {
  const v = String(raw ?? '').trim()
  if (!v || v === '—' || v === '-') return null
  return v
}

const splitMulti = (raw) => {
  const v = trimOrNull(raw)
  if (!v) return []
  // Notion exports multi-select as comma-separated. Some values legitimately
  // contain "/" or "(", but never commas, so this is safe.
  return v.split(',').map((s) => s.trim()).filter(Boolean)
}

// Notion date formats (both appear in the export):
//   long:  "September 11, 2026 1:07 AM (GMT-3)"
//   short: "February 23, 2026"           (older entries, no time)
const LONG_DATE_RE  = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)\s*\(GMT([+-]\d+)\)/i
const SHORT_DATE_RE = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})\s*$/i

const MONTHS = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
}

const parseNotionDate = (raw) => {
  if (!raw) return null
  const s = String(raw).trim()

  const longMatch = LONG_DATE_RE.exec(s)
  if (longMatch) {
    const [, monthName, dayStr, yearStr, hourStr, minStr, ampm, offsetStr] = longMatch
    const month = MONTHS[monthName.toLowerCase()]
    if (!month) return null
    let hour = parseInt(hourStr, 10) % 12
    if (ampm.toUpperCase() === 'PM') hour += 12
    const offset = parseInt(offsetStr, 10)
    const sign = offset >= 0 ? '+' : '-'
    const absOff = Math.abs(offset).toString().padStart(2, '0')
    const iso =
      `${yearStr}-${String(month).padStart(2, '0')}-${dayStr.padStart(2, '0')}` +
      `T${String(hour).padStart(2, '0')}:${minStr.padStart(2, '0')}:00${sign}${absOff}:00`
    const d = new Date(iso)
    return isNaN(d.getTime()) ? null : d
  }

  const shortMatch = SHORT_DATE_RE.exec(s)
  if (shortMatch) {
    const [, monthName, dayStr, yearStr] = shortMatch
    const month = MONTHS[monthName.toLowerCase()]
    if (!month) return null
    // No time or timezone in the source: anchor to UTC noon so day-based reads
    // land on the correct date in any timezone a reader might be in.
    const iso = `${yearStr}-${String(month).padStart(2, '0')}-${dayStr.padStart(2, '0')}T12:00:00Z`
    const d = new Date(iso)
    return isNaN(d.getTime()) ? null : d
  }

  return null
}

// --- Row mapping ----------------------------------------------------------

const mapRow = (row) => {
  const email = trimOrNull(row.Email)
  const submittedAt = parseNotionDate(row.Date)
  return {
    nombre: trimOrNull(row.Name),
    apellido: trimOrNull(row['Last Name']),
    email,
    genero: normalizeGender(row.Gender),
    ubicacion: trimOrNull(row.Location),
    ipLocation: trimOrNull(row.IPLocation),
    place: trimOrNull(row.Place),
    fit: trimOrNull(row.Fit),
    personalidad: splitMulti(row.Personality),
    caracteristicas: trimOrNull(row.Characteristics),
    tiempo: trimOrNull(row.Time),
    sugerencia: trimOrNull(row.Sugerencia),
    results: splitMulti(row.Results),
    comunicaciones: yesNo(row['Communications Accepted']),
    procesamiento: yesNo(row['Data Processing Accepted']),
    submittedAt,
    _raw: row,
  }
}

// --- Load + dedupe --------------------------------------------------------

const raw = fs.readFileSync(csvPath, 'utf8').replace(/^﻿/, '')
const rows = parse(raw, { columns: true, relax_quotes: true, skip_empty_lines: true })
console.log(`[import] Parsed ${rows.length} CSV rows from ${path.basename(csvPath)}`)

const mapped = rows.map(mapRow)
const skippedNoKey = mapped.filter((r) => !r.email && !r.submittedAt).length

const seen = new Map()
const toInsert = []
let localDupes = 0
for (const r of mapped) {
  if (!r.email && !r.submittedAt) continue
  const key = r.email && r.submittedAt ? `${r.email.toLowerCase()}|${r.submittedAt.toISOString()}` : null
  if (key) {
    if (seen.has(key)) {
      localDupes++
      continue
    }
    seen.set(key, true)
  }
  toInsert.push(r)
}

console.log(`[import] Deduped ${localDupes} rows (same email + exact timestamp)`)
if (skippedNoKey) console.log(`[import] Skipped ${skippedNoKey} rows with no email AND no date`)
console.log(`[import] Candidates to insert: ${toInsert.length}`)

if (dryRun) {
  console.log('[import] --dry-run: nothing written. Sample mapped row:')
  console.log(JSON.stringify({ ...toInsert[0], _raw: undefined }, null, 2))
  process.exit(0)
}

// --- Insert ---------------------------------------------------------------

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

await initDb()
console.log('[import] Schema ensured (initDb completed)')

const INSERT_SQL = `
  INSERT INTO style_test_submissions (
    nombre, apellido, email, genero, ubicacion, ip_location, place, fit,
    personalidad, caracteristicas, tiempo, sugerencia, results,
    comunicaciones, procesamiento, payload,
    source, submitted_at, created_at, notion_saved
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9::jsonb, $10, $11, $12, $13::jsonb,
    $14, $15, $16::jsonb,
    'notion-import', $17, COALESCE($17, now()), true
  )
  ON CONFLICT (email, submitted_at) WHERE email IS NOT NULL AND submitted_at IS NOT NULL DO NOTHING
`

let inserted = 0
let skipped = 0
let failed = 0

for (const r of toInsert) {
  try {
    const payload = { ...r._raw }
    const res = await pool.query(INSERT_SQL, [
      r.nombre,
      r.apellido,
      r.email,
      r.genero,
      r.ubicacion,
      r.ipLocation,
      r.place,
      r.fit,
      JSON.stringify(r.personalidad || []),
      r.caracteristicas,
      r.tiempo,
      r.sugerencia,
      JSON.stringify(r.results || []),
      r.comunicaciones,
      r.procesamiento,
      JSON.stringify(payload),
      r.submittedAt,
    ])
    if (res.rowCount === 1) inserted++
    else skipped++
  } catch (err) {
    failed++
    console.error(`[import] insert failed for ${r.email || '(no email)'} @ ${r.submittedAt?.toISOString() || '(no date)'}:`, err.message)
  }
}

console.log('--- Summary ---')
console.log(`Inserted: ${inserted}`)
console.log(`Skipped (already in DB): ${skipped}`)
console.log(`Failed: ${failed}`)

await pool.end()
process.exit(failed > 0 ? 2 : 0)
