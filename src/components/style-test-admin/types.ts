// Shape of one row returned by GET /api/admin/style-test (camelCase, no payload).
export interface StyleTestRow {
  id: string
  submittedAt: string | null
  createdAt: string
  nombre: string | null
  apellido: string | null
  email: string | null
  genero: string | null
  ubicacion: string | null
  ipLocation: string | null
  place: string | null
  fit: string | null
  personalidad: string[]
  caracteristicas: string | null
  tiempo: string | null
  sugerencia: string | null
  results: string[]
  comunicaciones: boolean
  procesamiento: boolean
  source: string
  notionSaved: boolean
  notionError: string | null
  emailMessageId: string | null
}

export interface ColumnDef {
  id: string
  label: string
  sortable: boolean
}

export type ColumnVisibility = Record<string, boolean>

// Persisted column layout for the admin table: display order + visibility.
export interface ColumnsConfig {
  order: string[]
  visible: ColumnVisibility
}
