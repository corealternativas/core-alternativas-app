import { Router } from 'express'
import nodemailer from 'nodemailer'
import { Client as NotionClient } from '@notionhq/client'
import { query } from '../db.js'

const router = Router()

const GENDER_OPTIONS = [
  'mujer',
  'hombre',
  'no-binario',
  'otro',
  'prefiero-no-decir',
]

function createTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment.')
  }
  // Use port 587 + STARTTLS explicitly instead of `service: 'gmail'` (which
  // defaults to 465 SMTPS). Railway tends to block outbound 465 but may let
  // 587 through, so this is worth trying before falling back to an HTTP email
  // provider. Explicit timeouts keep a blocked socket from hanging the worker.
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  })
}

async function sendEmail({ to, subject = 'No subject', html, text, replyTo }) {
  const transporter = createTransporter()
  const from = process.env.GMAIL_USER
  const mail = {
    from: `"${process.env.GMAIL_FROM_NAME || 'Core Style Test'}" <${from}>`,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  }
  const result = await transporter.sendMail(mail)
  return { messageId: result.messageId }
}

function richText(value) {
  return { rich_text: [{ text: { content: value || '—' } }] }
}

async function saveToNotion(data) {
  const databaseId = process.env.NOTION_DB_ID
  const notionToken = process.env.NOTION_TOKEN
  if (!databaseId) throw new Error('Missing NOTION_DB_ID in environment.')
  if (!notionToken) throw new Error('Missing NOTION_TOKEN in environment.')

  const notion = new NotionClient({ auth: notionToken })

  const generoNormalized = String(data.genero || '').trim().toLowerCase()
  const genderSelect = GENDER_OPTIONS.includes(generoNormalized)
    ? generoNormalized
    : 'prefiero-no-decir'

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: data.nombre || '—' } }] },
      'Last Name': richText(data.apellido),
      Email: { email: data.email && String(data.email).trim() ? String(data.email).trim() : null },
      Gender: { select: { name: genderSelect } },
      Location: richText(data.ubicacion),
      Personality: {
        multi_select: (data.personalidad || [])
          .filter(Boolean)
          .map((name) => ({ name: String(name).trim() })),
      },
      Characteristics: richText(data.caracteristicas),
      Time: richText(data.tiempo),
      'Communications Accepted': { checkbox: Boolean(data.comunicaciones) },
      'Data Processing Accepted': { checkbox: Boolean(data.procesamiento) },
      Sugerencia: richText(data.sugerencia ?? ''),
      Results: {
        multi_select: (data.results || [])
          .filter(Boolean)
          .map((name) => ({ name: String(name).trim() })),
      },
      IPLocation: richText(data.ipLocation && String(data.ipLocation).trim() ? data.ipLocation : '-'),
      Date: { date: { start: new Date().toISOString() } },
    },
  })
}

// Writes the submission row and returns its id. Called synchronously so the
// shareable UUID can be handed back to the client immediately.
async function persistSubmission({ formData }) {
  const {
    nombre = null,
    apellido = null,
    email = null,
    genero = null,
    ubicacion = null,
    ipLocation = null,
    place = null,
    fit = null,
    personalidad = [],
    caracteristicas = null,
    tiempo = null,
    sugerencia = null,
    results = [],
    comunicaciones = false,
    procesamiento = false,
  } = formData || {}

  const { rows } = await query(
    `
    INSERT INTO style_test_submissions (
      nombre, apellido, email, genero, ubicacion, ip_location, place, fit,
      personalidad, caracteristicas, tiempo, sugerencia, results,
      comunicaciones, procesamiento, payload, source, submitted_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9::jsonb, $10, $11, $12, $13::jsonb,
      $14, $15, $16::jsonb, 'app', now()
    )
    RETURNING id
    `,
    [
      nombre,
      apellido,
      email,
      genero,
      ubicacion,
      ipLocation,
      place,
      fit,
      JSON.stringify(personalidad || []),
      caracteristicas,
      tiempo,
      sugerencia,
      JSON.stringify(results || []),
      Boolean(comunicaciones),
      Boolean(procesamiento),
      JSON.stringify(formData || {}),
    ]
  )
  return rows[0].id
}

// Updates the row with the outcome of the background email + Notion calls.
async function updateSubmissionStatus(id, { messageId, notionSaved, notionError }) {
  await query(
    `UPDATE style_test_submissions
     SET email_message_id = $2, notion_saved = $3, notion_error = $4
     WHERE id = $1`,
    [id, messageId || null, Boolean(notionSaved), notionError || null]
  )
}

// Fires both outbound calls in parallel without blocking the HTTP response.
// Errors are logged (never thrown) so the submission stays in DB even when
// the email provider or Notion is down.
async function processSubmissionBackground({ submissionId, formData, emailArgs }) {
  const [emailResult, notionResult] = await Promise.allSettled([
    sendEmail(emailArgs),
    saveToNotion(formData),
  ])

  let messageId = null
  let notionSaved = false
  let notionError = null

  if (emailResult.status === 'fulfilled') {
    messageId = emailResult.value.messageId
  } else {
    const err = emailResult.reason
    const msg = err instanceof Error ? err.message : String(err)
    const code = err?.code ? ` (${err.code})` : ''
    console.error(`[style-test] email failed for ${submissionId}:${code} ${msg}`)
  }

  if (notionResult.status === 'fulfilled') {
    notionSaved = true
  } else {
    const err = notionResult.reason
    notionError = err instanceof Error ? err.message : String(err)
    console.error(`[style-test] Notion save failed for ${submissionId}:`, notionError)
  }

  try {
    await updateSubmissionStatus(submissionId, { messageId, notionSaved, notionError })
  } catch (err) {
    console.error(`[style-test] failed to persist status for ${submissionId}:`, err)
  }
}

// POST /api/style-test/submit
// Body: { to, subject?, html, text?, replyTo?, formData }
// The DB write runs synchronously so we can hand back the shareable id. Email
// (nodemailer / Gmail) and the Notion mirror are fired-and-forgotten after the
// response — a slow or dead SMTP endpoint used to hang the request for 2 min.
router.post('/submit', async (req, res) => {
  const { to, subject, html, text, replyTo, formData } = req.body || {}

  if (!to || typeof to !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "to" (recipient email)' })
  }
  if (html === undefined || html === null) {
    return res.status(400).json({ error: 'Missing "html" (email body)' })
  }
  if (!formData || typeof formData !== 'object') {
    return res.status(400).json({ error: 'Missing "formData"' })
  }

  let submissionId
  try {
    submissionId = await persistSubmission({ formData })
  } catch (err) {
    console.error('[style-test] DB persist failed:', err)
    return res.status(500).json({ error: 'Failed to save your submission. Please try again.' })
  }

  res.json({
    success: true,
    id: submissionId,
    async: true,
  })

  const emailArgs = {
    to: to.trim(),
    subject: subject != null ? String(subject) : 'No subject',
    html: String(html),
    text: text != null ? String(text) : undefined,
    replyTo: replyTo != null ? String(replyTo).trim() : undefined,
  }
  processSubmissionBackground({ submissionId, formData, emailArgs }).catch((err) => {
    console.error(`[style-test] background task threw for ${submissionId}:`, err)
  })
})

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function toArray(v) {
  return Array.isArray(v) ? v : []
}

// GET /api/style-test/results/:id
// PUBLIC (no auth): the shareable page a client opens from the link the admin copies.
// The UUID is the only access control, so the response is a strict whitelist of the
// subject's own answers + results. Never add email, ip_location, place, source,
// opt-ins, notion_* or email_message_id here.
router.get('/results/:id', async (req, res) => {
  // Keep this response out of search engines even if the UUID ever leaks.
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
  const { id } = req.params
  if (!UUID_RE.test(id)) {
    return res.status(400).json({ error: 'invalid id' })
  }

  try {
    const { rows } = await query(
      `SELECT id, nombre, apellido, genero, ubicacion, personalidad,
              caracteristicas, tiempo, fit, results, sugerencia,
              submitted_at, created_at
       FROM style_test_submissions
       WHERE id = $1`,
      [id]
    )
    const r = rows[0]
    if (!r) {
      return res.status(404).json({ error: 'not found' })
    }

    const when = r.submitted_at || r.created_at
    return res.json({
      id: r.id,
      nombre: r.nombre,
      apellido: r.apellido,
      genero: r.genero,
      ubicacion: r.ubicacion,
      personalidad: toArray(r.personalidad),
      caracteristicas: r.caracteristicas,
      tiempo: r.tiempo,
      fit: r.fit,
      results: toArray(r.results),
      sugerencia: r.sugerencia,
      submittedAt: when ? new Date(when).toISOString() : null,
    })
  } catch (err) {
    console.error('[style-test] RESULTS error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
