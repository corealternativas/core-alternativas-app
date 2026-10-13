import express from 'express'
import { query } from '../db.js'
import { hashPassword } from '../utils/password.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

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

const VALID_ROLES = new Set(['user', 'admin'])

router.use(requireAuth, requireAdmin)

router.get('/', async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, email, name, role, active, last_login_at, created_at
       FROM users
       ORDER BY created_at DESC`
    )
    res.json(result.rows.map(sanitizeUser))
  } catch (err) {
    console.error('[users] List error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { email, password, name, role } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password debe tener al menos 6 caracteres' })
    }

    const finalRole = VALID_ROLES.has(role) ? role : 'user'
    const hash = await hashPassword(password)
    const normalizedEmail = String(email).toLowerCase().trim()

    try {
      const result = await query(
        `INSERT INTO users (email, password_hash, name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, role, active, last_login_at, created_at`,
        [normalizedEmail, hash, name || null, finalRole]
      )
      res.status(201).json(sanitizeUser(result.rows[0]))
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un usuario con ese email' })
      }
      throw err
    }
  } catch (err) {
    console.error('[users] Create error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, role, active } = req.body || {}

    const updates = []
    const params = []

    if (name !== undefined) {
      params.push(name)
      updates.push(`name = $${params.length}`)
    }
    if (role !== undefined) {
      if (!VALID_ROLES.has(role)) {
        return res.status(400).json({ error: 'Role inválido' })
      }
      params.push(role)
      updates.push(`role = $${params.length}`)
    }
    if (active !== undefined) {
      params.push(!!active)
      updates.push(`active = $${params.length}`)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nada para actualizar' })
    }

    params.push(id)
    const result = await query(
      `UPDATE users SET ${updates.join(', ')}
       WHERE id = $${params.length}
       RETURNING id, email, name, role, active, last_login_at, created_at`,
      params
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (active === false) {
      await query(`DELETE FROM sessions WHERE user_id = $1`, [id])
    }

    res.json(sanitizeUser(result.rows[0]))
  } catch (err) {
    console.error('[users] Update error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/:id/reset-password', async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body || {}

    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: 'Password debe tener al menos 6 caracteres' })
    }

    const hash = await hashPassword(password)
    const result = await query(
      `UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id`,
      [hash, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    await query(`DELETE FROM sessions WHERE user_id = $1`, [id])

    res.json({ ok: true })
  } catch (err) {
    console.error('[users] Reset password error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (id === req.user.id) {
      return res.status(400).json({ error: 'No podés desactivarte a vos mismo' })
    }

    const result = await query(
      `UPDATE users SET active = false WHERE id = $1 RETURNING id`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    await query(`DELETE FROM sessions WHERE user_id = $1`, [id])
    res.json({ ok: true })
  } catch (err) {
    console.error('[users] Delete error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
