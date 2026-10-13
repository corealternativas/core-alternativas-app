import { query } from '../db.js'
import { hashPassword } from './password.js'

export async function seedAdminIfNeeded() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    console.log('[seed] No SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD env vars; skipping admin seed.')
    return
  }

  const existing = await query(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`)
  if (existing.rows.length > 0) {
    console.log('[seed] Admin user already exists; skipping seed.')
    return
  }

  const hash = await hashPassword(password)
  await query(
    `INSERT INTO users (email, password_hash, name, role, active)
     VALUES ($1, $2, $3, 'admin', true)
     ON CONFLICT (email) DO NOTHING`,
    [email.toLowerCase().trim(), hash, 'Admin']
  )
  console.log(`[seed] Admin user created: ${email}`)
}

export async function seedTestUserIfNeeded() {
  const email = process.env.SEED_USER_EMAIL
  const password = process.env.SEED_USER_PASSWORD

  if (!email || !password) {
    console.log('[seed] No SEED_USER_EMAIL / SEED_USER_PASSWORD env vars; skipping user seed.')
    return
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [normalizedEmail])
  if (existing.rows.length > 0) {
    console.log(`[seed] User ${normalizedEmail} already exists; skipping seed.`)
    return
  }

  const hash = await hashPassword(password)
  await query(
    `INSERT INTO users (email, password_hash, name, role, active)
     VALUES ($1, $2, $3, 'user', true)
     ON CONFLICT (email) DO NOTHING`,
    [normalizedEmail, hash, 'Usuario de prueba']
  )
  console.log(`[seed] Test user created: ${normalizedEmail}`)
}
