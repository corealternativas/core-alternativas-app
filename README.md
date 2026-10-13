# core-alternativas-app

Aplicación web unificada de CORE. Es una sola SPA (React + Vite + TS) con dos
áreas conviviendo bajo el mismo dominio, servidas por un backend Express
(Postgres) que corre en Railway.

## Áreas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/style-test` | Público | Formulario paso a paso ("Style Test"). Envía email (Gmail), guarda en Notion y persiste la respuesta en Postgres. |
| `/login` | Público | Login para usuarios/admins de la calculadora. |
| `/calculadora` | Usuario logueado | Calculadora de semana de uso de ropa (privada). |
| `/admin/users` | Admin | ABM de usuarios. |
| `/admin/results` | Admin | Vista de resultados de las calculadoras. |
| `/` | Redirige | Sin sesión → `/style-test`. User → `/calculadora`. Admin → `/admin/results`. |

Cada área usa su propio layout: el style-test renderiza su propio header con
progress bar y su footer con botones Anterior/Siguiente; la calculadora y el
admin comparten el layout con `Header` (nav + auth) y `Footer`.

## Stack

- Frontend: React 19, Vite 7, TypeScript, styled-components, React Router 6.
- Backend: Express, `pg` (Postgres), `bcrypt`, `nodemailer`, `@notionhq/client`.
- Deploy: Railway (Docker single-container que sirve el `dist/` del front y
  expone `/api/*`).

## Estructura

```
core-alternativas-app/
├── api/                              Backend Express
│   ├── index.js                      Entry point (sirve dist/ + /api)
│   ├── db.js                         Pool de pg + migraciones (initDb)
│   ├── middleware/auth.js
│   ├── utils/                        password, seed, validateCells
│   └── routes/
│       ├── auth.js                   /api/auth/*
│       ├── users.js                  /api/admin/users/*
│       ├── calculations.js           /api/calculations/*
│       ├── admin-calculations.js     /api/admin/calculations/*
│       └── style-test.js             /api/style-test/submit
├── src/                              Frontend
│   ├── App.tsx                       Router principal
│   ├── pages/                        Login, Calculator, Admin, AdminResults, StyleTest
│   ├── context/AuthContext.tsx
│   ├── components/
│   │   ├── Header/                   Header del área calculadora/admin
│   │   ├── Footer/                   Footer del área calculadora/admin
│   │   ├── RootRedirect.tsx          Redirección de `/` según sesión
│   │   ├── ...                       resto de componentes del calculator
│   │   └── style-test/               Componentes propios del Style Test
│   │       ├── StepByStepForm/       formulario completo
│   │       ├── Header/               header con progress bar (interno)
│   │       ├── Footer/               footer con botones nav (interno)
│   │       └── ...
│   ├── services/
│   │   ├── services.ts               apiFetch + token helpers
│   │   └── styleTest.ts              cliente HTTP para /api/style-test/submit
│   ├── utils/                        utils del calculator
│   │   └── style-test/               utils del Style Test (emailBuilder, styleData, ...)
│   ├── domain/categories.ts
│   └── theme.ts
├── public/                           coreLogo.webp, coreFavicon.webp
├── Dockerfile
├── vite.config.ts                    proxy /api → :3001 en dev
└── .env.example
```

## Setup local

1. Copiar variables de entorno:

   ```bash
   cp .env.example .env.local
   ```

   Llenar:
   - `DATABASE_URL` (Postgres local o de Railway).
   - `SEED_ADMIN_*`, `SEED_USER_*` (opcional, se crean solo si no existen).
   - `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `GMAIL_FROM_NAME` (para enviar los mails del style test).
   - `NOTION_TOKEN`, `NOTION_DB_ID` (para persistir las respuestas en Notion).

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Levantar el backend (puerto 3001) y el frontend (puerto 5173) en terminales separadas:

   ```bash
   npm run dev:server
   ```

   ```bash
   npm run dev
   ```

   El proxy de Vite envía `/api/*` al backend.

## Build de producción

```bash
npm run build   # tsc -b && vite build → genera dist/
npm start       # node api/index.js — sirve dist/ y expone /api
```

En producción, `api/index.js` sirve el `dist/` del front y todas las rutas SPA
caen a `index.html`, excepto las que empiezan por `/api/`.

## Deploy en Railway

- Un solo servicio: build con el `Dockerfile` provisto. Railway detecta el
  puerto que expone el server (`process.env.PORT`).
- Añadir el plugin de Postgres y setear `DATABASE_URL` en variables del servicio.
- Setear también `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `GMAIL_FROM_NAME`,
  `NOTION_TOKEN`, `NOTION_DB_ID`, `SEED_*` según corresponda.
- Al primer boot, `initDb()` crea las tablas si no existen:
  `users`, `sessions`, `calculations`, `style_test_submissions`.

## Migraciones

Todas las tablas se crean con `CREATE TABLE IF NOT EXISTS` en `api/db.js`
(`initDb`). Cambios aditivos (columnas nuevas, índices) van ahí con
`ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para que sean seguros de aplicar
sobre bases que ya tienen datos. Para cambios destructivos (renombres, drops)
hay que escribir la migración manual y aplicarla contra la DB de Railway antes
del deploy.

### Tabla `style_test_submissions`

Guarda cada respuesta del Style Test. Columnas:

- Datos del formulario: `nombre`, `apellido`, `email`, `genero`, `ubicacion`,
  `personalidad` (JSONB array), `caracteristicas`, `tiempo`, `sugerencia`,
  `results` (JSONB array), `comunicaciones`, `procesamiento`.
- Datos derivados / históricos: `ip_location`, `place` (ciudad detectada por
  Notion), `fit` (campo legacy, "Más bien ajustada"/"Más bien suelta").
- Metadata: `payload` (JSONB con el request/row completo), `email_message_id`,
  `notion_saved`, `notion_error`, `source` (`app` para submits nuevos,
  `notion-import` para los importados), `submitted_at`, `created_at`.
- Unique index `(email, submitted_at)` para que re-ejecutar el import sea
  idempotente.

## Importar el histórico de Notion

Export del Notion DB en CSV ("Client Style Test Results …_all.csv"). El `_all`
incluye la columna `Fit` que las versiones recientes no tienen.

```bash
# Validar el CSV sin tocar la DB
node scripts/import-style-test-csv.mjs <path-al-csv> --dry-run

# Importar contra la DB apuntada por DATABASE_URL
DATABASE_URL=postgres://... node scripts/import-style-test-csv.mjs <path-al-csv>
```

El script:

1. Lee y parsea el CSV (soporta las dos variantes de fecha del export: la larga
   con hora + GMT, y la corta sin hora).
2. Dedupe local por `(email + submitted_at)` exactos (los "doble submit" de
   Notion).
3. Llama `initDb()` para garantizar el schema actualizado.
4. Inserta cada fila con `source = 'notion-import'` y `submitted_at` tomado del
   CSV. El `payload` guarda el row CSV completo por si hay que re-mapear
   después.
5. El unique index `(email, submitted_at)` hace que correr el script dos veces
   no genere duplicados — las filas ya presentes se saltean.

Para re-importar desde cero (p.ej. tras arreglar el mapeo):

```sql
DELETE FROM style_test_submissions WHERE source = 'notion-import';
```

y volver a correr el script.
