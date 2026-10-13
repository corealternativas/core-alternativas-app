import express from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { emptyGrid, validateCells } from '../utils/validateCells.js'

const router = express.Router()

router.use(requireAuth)

router.get('/me', async (req, res) => {
  try {
    const result = await query(
      `SELECT cells, updated_at, created_at
       FROM calculations
       WHERE user_id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.json({
        cells: emptyGrid(),
        updated_at: null,
        created_at: null,
        exists: false,
      })
    }

    const row = result.rows[0]
    res.json({
      cells: row.cells,
      updated_at: row.updated_at,
      created_at: row.created_at,
      exists: true,
    })
  } catch (err) {
    console.error('[calculations] GET /me error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/me', async (req, res) => {
  try {
    const { cells } = req.body || {}
    const check = validateCells(cells)
    if (!check.ok) {
      return res.status(400).json({ error: check.error })
    }

    const result = await query(
      `INSERT INTO calculations (user_id, cells)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (user_id) DO UPDATE
         SET cells = EXCLUDED.cells,
             updated_at = now()
       RETURNING cells, updated_at, created_at`,
      [req.user.id, JSON.stringify(cells)]
    )

    const row = result.rows[0]
    res.json({
      cells: row.cells,
      updated_at: row.updated_at,
      created_at: row.created_at,
      exists: true,
    })
  } catch (err) {
    console.error('[calculations] PUT /me error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
