const VALID_CODES = new Set(['A', 'B', 'C', 'D', 'E', 'F'])
const DAYS = 7
const HOURS = 24

export function validateCells(cells) {
  if (!Array.isArray(cells) || cells.length !== DAYS) {
    return { ok: false, error: `cells must be an array of ${DAYS} days` }
  }
  for (let d = 0; d < DAYS; d++) {
    const row = cells[d]
    if (!Array.isArray(row) || row.length !== HOURS) {
      return { ok: false, error: `cells[${d}] must be an array of ${HOURS} hours` }
    }
    for (let h = 0; h < HOURS; h++) {
      const v = row[h]
      if (v === null) continue
      if (typeof v !== 'string' || !VALID_CODES.has(v)) {
        return {
          ok: false,
          error: `cells[${d}][${h}] must be null or one of A|B|C|D|E|F (got ${JSON.stringify(v)})`,
        }
      }
    }
  }
  return { ok: true }
}

export function emptyGrid() {
  return Array.from({ length: DAYS }, () => Array(HOURS).fill(null))
}
