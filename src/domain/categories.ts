export type CategoryCode = "A" | "B" | "C" | "D" | "E" | "F"

export interface Category {
  code: CategoryCode
  label: string
  description: string
  color: string
}

export const CATEGORIES: Category[] = [
  {
    code: "A",
    label: "Casa",
    description: "Estar en tu casa (home office, espacios libres)",
    color: "#FFE7A8",
  },
  {
    code: "B",
    label: "Oficina",
    description: "Estar en un espacio de oficina/formal",
    color: "#BCE0C7",
  },
  {
    code: "C",
    label: "Deporte",
    description: "Deporte/espacios activos",
    color: "#F0B8C2",
  },
  {
    code: "D",
    label: "Salir",
    description: "Salir a comer/tomar algo/bailar/fiesta",
    color: "#B8D0EC",
  },
  {
    code: "E",
    label: "Admin",
    description: "Actividades diarias de admin (compras, mandados, etc)",
    color: "#C9C1E0",
  },
  {
    code: "F",
    label: "Dormir",
    description: "Dormir",
    color: "#DDDDDD",
  },
]

export const CATEGORIES_BY_CODE: Record<CategoryCode, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.code] = c
    return acc
  },
  {} as Record<CategoryCode, Category>
)

export const DAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
]

export const DAYS = 7
export const HOURS = 24
export const TOTAL_CELLS = DAYS * HOURS

export type Cell = CategoryCode | null
export type Grid = Cell[][]

export function emptyGrid(): Grid {
  return Array.from({ length: DAYS }, () => Array(HOURS).fill(null) as Cell[])
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.slice())
}

export interface CategoryStat {
  code: CategoryCode
  label: string
  color: string
  hours: number
  percent: number
}

export interface GridStats {
  perCategory: CategoryStat[]
  totalAssigned: number
}

export function computeStats(grid: Grid): GridStats {
  const counts: Record<CategoryCode, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  }
  let totalAssigned = 0
  for (let d = 0; d < DAYS; d++) {
    for (let h = 0; h < HOURS; h++) {
      const v = grid[d]?.[h]
      if (v && v in counts) {
        counts[v as CategoryCode] += 1
        totalAssigned += 1
      }
    }
  }
  const perCategory: CategoryStat[] = CATEGORIES.map((cat) => {
    const hours = counts[cat.code]
    const percent = totalAssigned > 0 ? (hours / totalAssigned) * 100 : 0
    return {
      code: cat.code,
      label: cat.label,
      color: cat.color,
      hours,
      percent,
    }
  })
  return { perCategory, totalAssigned }
}
