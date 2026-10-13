import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { initDb } from './db.js'
import { seedAdminIfNeeded, seedTestUserIfNeeded } from './utils/seed.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import calculationsRouter from './routes/calculations.js'
import adminCalculationsRouter from './routes/admin-calculations.js'
import styleTestRouter from './routes/style-test.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/admin/users', usersRouter)
app.use('/api/admin/calculations', adminCalculationsRouter)
app.use('/api/calculations', calculationsRouter)
app.use('/api/style-test', styleTestRouter)

const distDir = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    const indexPath = path.join(distDir, 'index.html')
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath)
    }
    res.status(404).send('Not found')
  })
}

async function start() {
  try {
    await initDb()
    console.log('[server] Database initialized')
    await seedAdminIfNeeded()
    await seedTestUserIfNeeded()
  } catch (err) {
    console.error('[server] Failed to initialize database:', err)
    if (process.env.DATABASE_URL) {
      process.exit(1)
    }
    console.warn('[server] Starting without database (no DATABASE_URL set)')
  }

  app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT}`)
  })
}

start()
