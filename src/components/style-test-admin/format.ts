const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

// "11/09/2026 01:07" (dd/MM/yyyy HH:mm, es-AR) in the viewer's local time.
// Built from parts so the result never depends on the ICU date/time separator
// (newer engines emit "11/09/2026, 01:07").
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  const p: Record<string, string> = {}
  for (const part of dateTimeFormatter.formatToParts(d)) p[part.type] = part.value
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`
}

export function fullName(nombre: string | null, apellido: string | null): string {
  return [nombre, apellido]
    .map((v) => (v ?? "").trim())
    .filter(Boolean)
    .join(" ")
}

export function hasText(v: string | null | undefined): v is string {
  return typeof v === "string" && v.trim().length > 0
}
