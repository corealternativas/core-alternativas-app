const pad = (n: number) => String(n).padStart(2, "0")

// "2026-09-11 01:07" in the viewer's local time (same format as the mock).
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
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
