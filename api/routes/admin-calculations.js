import express from 'express'
import { query } from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth, requireAdmin)

router.get('/', async (_req, res) => {
  try {
    const result = await query(
      `SELECT u.id AS user_id, u.email, u.name, u.role, u.active,
              c.updated_at AS calculation_updated_at,
              (c.id IS NOT NULL) AS has_calc
       FROM users u
       LEFT JOIN calculations c ON c.user_id = u.id
       WHERE u.role = 'user'
       ORDER BY (c.updated_at IS NULL) ASC, c.updated_at DESC, u.email ASC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error('[admin-calculations] LIST error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const userResult = await query(
      `SELECT id, email, name, role, active, created_at, last_login_at
       FROM users
       WHERE id = $1`,
      [userId]
    )
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const calcResult = await query(
      `SELECT cells, updated_at, created_at
       FROM calculations
       WHERE user_id = $1`,
      [userId]
    )

    const calc = calcResult.rows[0] || null
    res.json({
      user: userResult.rows[0],
      calculation: calc
        ? {
            cells: calc.cells,
            updated_at: calc.updated_at,
            created_at: calc.created_at,
          }
        : null,
    })
  } catch (err) {
    console.error('[admin-calculations] GET :userId error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
