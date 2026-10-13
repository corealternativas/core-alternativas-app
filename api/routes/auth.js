import express from 'express'
import crypto from 'crypto'
import { query } from '../db.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

const SESSION_TTL_DAYS = 30

function sanitizeUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    active: row.active,
    last_login_at: row.last_login_at,
    created_at: row.created_at,
  }
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const result = await query(
      `SELECT id, email, password_hash, name, role, active, last_login_at, created_at
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const user = result.rows[0]

    if (!user.active) {
      return res.status(403).json({ error: 'Usuario inactivo' })
    }

    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS)

    await query(
      `INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt.toISOString()]
    )

    await query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [user.id])

    res.json({
      token,
      user: sanitizeUser(user),
    })
  } catch (err) {
    console.error('[auth] Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/logout', requireAuth, async (req, res) => {
  try {
    await query(`DELETE FROM sessions WHERE id = $1`, [req.sessionId])
    res.json({ ok: true })
  } catch (err) {
    console.error('[auth] Logout error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {}

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' })
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
    }

    const result = await query(`SELECT password_hash FROM users WHERE id = $1`, [req.user.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const ok = await verifyPassword(currentPassword, result.rows[0].password_hash)
    if (!ok) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' })
    }

    const hash = await hashPassword(newPassword)
    await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hash, req.user.id])

    // Invalidate all other sessions but keep the current one active
    await query(`DELETE FROM sessions WHERE user_id = $1 AND id <> $2`, [req.user.id, req.sessionId])

    res.json({ ok: true })
  } catch (err) {
    console.error('[auth] Change password error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, name, role, active, last_login_at, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ user: sanitizeUser(result.rows[0]) })
  } catch (err) {
    console.error('[auth] Me error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
