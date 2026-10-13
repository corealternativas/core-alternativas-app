import { query } from '../db.js'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' })
  }

  const token = header.slice('Bearer '.length).trim()
  if (!token) {
    return res.status(401).json({ error: 'Authorization required' })
  }

  try {
    const result = await query(
      `SELECT s.id AS session_id, s.expires_at, u.id, u.email, u.name, u.role, u.active
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = $1`,
      [token]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const row = result.rows[0]

    if (new Date(row.expires_at) < new Date()) {
      await query(`DELETE FROM sessions WHERE id = $1`, [row.session_id])
      return res.status(401).json({ error: 'Session expired' })
    }

    if (!row.active) {
      return res.status(403).json({ error: 'User is inactive' })
    }

    req.user = {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
    }
    req.sessionId = row.session_id
    req.token = token
    next()
  } catch (err) {
    console.error('[auth] Middleware error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
