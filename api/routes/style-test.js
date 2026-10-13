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
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
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

async function persistSubmission({ formData, messageId, notionSaved, notionError }) {
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

  await query(
    `
    INSERT INTO style_test_submissions (
      nombre, apellido, email, genero, ubicacion, ip_location, place, fit,
      personalidad, caracteristicas, tiempo, sugerencia, results,
      comunicaciones, procesamiento, payload, email_message_id,
      notion_saved, notion_error, source, submitted_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9::jsonb, $10, $11, $12, $13::jsonb,
      $14, $15, $16::jsonb, $17,
      $18, $19, 'app', now()
    )
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
      messageId || null,
      Boolean(notionSaved),
      notionError || null,
    ]
  )
}

// POST /api/style-test/submit
// Body: { to, subject?, html, text?, replyTo?, formData }
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

  let messageId = null
  try {
    const emailResult = await sendEmail({
      to: to.trim(),
      subject: subject != null ? String(subject) : 'No subject',
      html: String(html),
      text: text != null ? String(text) : undefined,
      replyTo: replyTo != null ? String(replyTo).trim() : undefined,
    })
    messageId = emailResult.messageId
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return res.status(500).json({ error: `Failed to send email: ${errorMessage}` })
  }

  let notionSaved = false
  let notionError = null
  try {
    await saveToNotion(formData)
    notionSaved = true
  } catch (err) {
    notionError = err instanceof Error ? err.message : String(err)
    console.error('[style-test] Notion save failed:', notionError)
  }

  try {
    await persistSubmission({ formData, messageId, notionSaved, notionError })
  } catch (err) {
    console.error('[style-test] DB persist failed:', err)
    // Do not fail the request: the email already went out.
  }

  return res.json({
    success: true,
    messageId,
    notionSaved,
    notionError,
  })
})

export default router
