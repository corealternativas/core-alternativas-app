import express from 'express'
import { query } from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth, requireAdmin)

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 200
const SOURCES = new Set(['app', 'notion-import'])

// Whitelist of sortable columns: frontend column id -> SQL expression.
// `text: true` columns are sorted case-insensitively. The expression that ends up in
// ORDER BY always comes from this table, never from user input.
const SORT_COLUMNS = {
  date: { col: 'submitted_at' },
  name: { col: 'nombre', text: true },
  lastname: { col: 'apellido', text: true },
  email: { col: 'email', text: true },
  gender: { col: 'genero', text: true },
  location: { col: 'ubicacion', text: true },
  place: { col: 'place', text: true },
  time: { col: 'tiempo', text: true },
  fit: { col: 'fit', text: true },
  comms: { col: 'comunicaciones' },
  dataproc: { col: 'procesamiento' },
  iplocation: { col: 'ip_location', text: true },
  source: { col: 'source', text: true },
}

const LIST_COLUMNS = `
  id, submitted_at, created_at, nombre, apellido, email, genero, ubicacion,
  ip_location, place, fit, personalidad, caracteristicas, tiempo, sugerencia,
  results, comunicaciones, procesamiento, source, notion_saved, notion_error,
  email_message_id
`

const CSV_HEADERS = [
  'submitted_at',
  'nombre',
  'apellido',
  'email',
  'genero',
  'ubicacion',
  'place',
  'personalidad',
  'caracteristicas',
  'tiempo',
  'fit',
  'results',
  'sugerencia',
  'comunicaciones',
  'procesamiento',
  'ip_location',
  'source',
]

function firstString(v) {
  if (Array.isArray(v)) return typeof v[0] === 'string' ? v[0] : ''
  return typeof v === 'string' ? v : ''
}

function parseDate(v) {
  const s = firstString(v).trim()
  if (!s) return null
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return null
  return { date: d, dateOnly: /^\d{4}-\d{2}-\d{2}$/.test(s) }
}

function escapeLike(s) {
  return s.replace(/[\\%_]/g, '\\$&')
}

// Builds the WHERE clause (parameterized) shared by list + export.
function buildFilters(q) {
  const where = []
  const params = []
  const add = (value) => {
    params.push(value)
    return `$${params.length}`
  }

  const search = firstString(q.q).trim()
  if (search) {
    const p = add(`%${escapeLike(search)}%`)
    where.push(`(email ILIKE ${p} OR nombre ILIKE ${p} OR apellido ILIKE ${p})`)
  }

  const from = parseDate(q.from)
  if (from) {
    where.push(`submitted_at >= ${add(from.date.toISOString())}::timestamptz`)
  }

  const to = parseDate(q.to)
  if (to) {
    const p = add(to.date.toISOString())
    // A bare date (YYYY-MM-DD) means "through the end of that day".
    where.push(
      to.dateOnly
        ? `submitted_at < (${p}::timestamptz + interval '1 day')`
        : `submitted_at <= ${p}::timestamptz`
    )
  }

  const source = firstString(q.source)
  if (SOURCES.has(source)) {
    where.push(`source = ${add(source)}`)
  }

  const gender = firstString(q.gender).trim()
  if (gender) {
    where.push(`genero = ${add(gender)}`)
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params,
  }
}

function buildOrderBy(sortParam) {
  const fallback = 'submitted_at DESC NULLS LAST, created_at DESC, id ASC'
  const raw = firstString(sortParam).trim()
  if (!raw) return fallback

  const [colId, dirRaw = 'asc'] = raw.split(':')
  const def = Object.hasOwn(SORT_COLUMNS, colId) ? SORT_COLUMNS[colId] : null
  const dir = dirRaw.toLowerCase()
  if (!def || (dir !== 'asc' && dir !== 'desc')) return fallback

  const expr = def.text ? `LOWER(${def.col})` : def.col
  // id as final tiebreaker keeps pagination stable.
  return `${expr} ${dir.toUpperCase()} NULLS LAST, id ASC`
}

function toIso(v) {
  return v ? new Date(v).toISOString() : null
}

function toArray(v) {
  return Array.isArray(v) ? v : []
}

function mapRow(r) {
  return {
    id: r.id,
    submittedAt: toIso(r.submitted_at),
    createdAt: toIso(r.created_at),
    nombre: r.nombre,
    apellido: r.apellido,
    email: r.email,
    genero: r.genero,
    ubicacion: r.ubicacion,
    ipLocation: r.ip_location,
    place: r.place,
    fit: r.fit,
    personalidad: toArray(r.personalidad),
    caracteristicas: r.caracteristicas,
    tiempo: r.tiempo,
    sugerencia: r.sugerencia,
    results: toArray(r.results),
    comunicaciones: r.comunicaciones,
    procesamiento: r.procesamiento,
    source: r.source,
    notionSaved: r.notion_saved,
    notionError: r.notion_error,
    emailMessageId: r.email_message_id,
  }
}

// Quote a CSV value when needed; double any internal quotes.
// Strings that start with a formula trigger are prefixed with a single quote so
// spreadsheet apps do not evaluate user-submitted text as a formula.
function csvEscape(v) {
  if (v === null || v === undefined) return ''
  let s = typeof v === 'string' ? v : String(v)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function joinPipe(v) {
  return toArray(v).join(' | ')
}

router.get('/stats', async (_req, res) => {
  try {
    const totals = await query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE submitted_at >= now() - interval '30 days')::int AS last_month,
              COUNT(*) FILTER (WHERE submitted_at >= now() - interval '7 days')::int AS last_week,
              COUNT(*) FILTER (WHERE comunicaciones = true)::int AS comms
       FROM style_test_submissions`
    )
    const top = await query(
      `SELECT r.value AS name, COUNT(*)::int AS count
       FROM style_test_submissions s,
            jsonb_array_elements_text(
              CASE WHEN jsonb_typeof(s.results) = 'array' THEN s.results ELSE '[]'::jsonb END
            ) AS r(value)
       GROUP BY r.value
       ORDER BY count DESC, r.value ASC
       LIMIT 1`
    )

    const { total, last_month: lastMonth, last_week: lastWeek, comms } = totals.rows[0]
    const topRow = top.rows[0]

    res.json({
      total,
      lastMonth,
      lastWeek,
      optInCommsCount: comms,
      optInCommsPct: total > 0 ? Math.round((100 * comms) / total) : 0,
      topStyle: topRow
        ? {
            name: topRow.name,
            count: topRow.count,
            pct: total > 0 ? Math.round((100 * topRow.count) / total) : 0,
          }
        : null,
    })
  } catch (err) {
    console.error('[admin-style-test] STATS error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/export', async (req, res) => {
  try {
    const { whereSql, params } = buildFilters(req.query)
    const orderBy = buildOrderBy(req.query.sort)

    const result = await query(
      `SELECT ${LIST_COLUMNS}
       FROM style_test_submissions
       ${whereSql}
       ORDER BY ${orderBy}`,
      params
    )

    const lines = [CSV_HEADERS.join(',')]
    for (const r of result.rows) {
      const values = [
        toIso(r.submitted_at),
        r.nombre,
        r.apellido,
        r.email,
        r.genero,
        r.ubicacion,
        r.place,
        joinPipe(r.personalidad),
        r.caracteristicas,
        r.tiempo,
        r.fit,
        joinPipe(r.results),
        r.sugerencia,
        r.comunicaciones,
        r.procesamiento,
        r.ip_location,
        r.source,
      ]
      lines.push(values.map(csvEscape).join(','))
    }

    const date = new Date().toISOString().slice(0, 10)
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="style-test-${date}.csv"`)
    // BOM so Excel detects UTF-8 (names/places have accents).
    res.send('﻿' + lines.join('\r\n') + '\r\n')
  } catch (err) {
    console.error('[admin-style-test] EXPORT error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(firstString(req.query.page), 10) || 1)
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(firstString(req.query.limit), 10) || DEFAULT_LIMIT)
    )
    const offset = (page - 1) * limit

    const { whereSql, params } = buildFilters(req.query)
    const orderBy = buildOrderBy(req.query.sort)

    const countResult = await query(
      `SELECT COUNT(*)::int AS total FROM style_test_submissions ${whereSql}`,
      params
    )

    // Offset pagination is fine at this table size (hundreds of rows).
    const rowsResult = await query(
      `SELECT ${LIST_COLUMNS}
       FROM style_test_submissions
       ${whereSql}
       ORDER BY ${orderBy}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    )

    res.json({
      rows: rowsResult.rows.map(mapRow),
      total: countResult.rows[0].total,
      page,
      limit,
    })
  } catch (err) {
    console.error('[admin-style-test] LIST error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
