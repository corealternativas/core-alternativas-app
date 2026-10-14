import React, { useCallback, useEffect, useMemo, useState } from "react"
import { apiFetch, getToken } from "../services/services"
import { Chip } from "../components/style-test-admin/Chip"
import { ColumnsMenu } from "../components/style-test-admin/ColumnsMenu"
import { StyleTestDrawer } from "../components/style-test-admin/StyleTestDrawer"
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  SortNeutralIcon,
} from "../components/style-test-admin/icons"
import { formatDateTime, hasText } from "../components/style-test-admin/format"
import type {
  ColumnDef,
  ColumnVisibility,
  StyleTestRow,
} from "../components/style-test-admin/types"
import {
  Container,
  PageTitle,
  Metrics,
  Metric,
  MetricLabel,
  MetricValue,
  MetricSub,
  FiltersBar,
  SearchWrap,
  SearchInput,
  DateRange,
  DateSep,
  Select,
  ExportButton,
  ErrorBanner,
  TableWrap,
  TableScroll,
  DataTable,
  CellDate,
  CellNowrap,
  CellText,
  Dash,
  ChipsWrap,
  Check,
  StatusMessage,
  PaginationBar,
  PaginationPages,
  PageButton,
  Ellipsis,
} from "./AdminStyleTest.style"

const COLS = [
  { id: "date", label: "Fecha", sortable: true },
  { id: "name", label: "Nombre", sortable: true },
  { id: "lastname", label: "Apellido", sortable: true },
  { id: "email", label: "Email", sortable: true },
  { id: "gender", label: "Gender", sortable: true },
  { id: "location", label: "Location", sortable: true },
  { id: "place", label: "Place", sortable: true },
  { id: "personality", label: "Personality", sortable: false },
  { id: "characteristics", label: "Characteristics", sortable: false },
  { id: "time", label: "Time", sortable: true },
  { id: "fit", label: "Fit", sortable: true },
  { id: "results", label: "Results", sortable: false },
  { id: "sugerencia", label: "Sugerencia", sortable: false },
  { id: "comms", label: "Comms", sortable: true },
  { id: "dataproc", label: "Data proc", sortable: true },
  { id: "iplocation", label: "IP Location", sortable: true },
  { id: "source", label: "Origen", sortable: true },
] as const satisfies readonly ColumnDef[]

const LS_KEY = "styleTestColsVisible_v2"
const PAGE_SIZES = [25, 50, 100] as const
const SEARCH_DEBOUNCE_MS = 300

type SortDir = "asc" | "desc"
interface SortState {
  col: string
  dir: SortDir
}

interface Stats {
  total: number
  lastMonth: number
  lastWeek: number
  optInCommsPct: number
  optInCommsCount: number
  topStyle: { name: string; count: number; pct: number } | null
}

interface ListResponse {
  rows: StyleTestRow[]
  total: number
  page: number
  limit: number
}

interface LoadedList {
  key: string
  rows: StyleTestRow[]
  total: number
  error: string | null
}

function defaultVisibility(): ColumnVisibility {
  return Object.fromEntries(COLS.map((c) => [c.id, true]))
}

function loadVisibility(): ColumnVisibility {
  const result = defaultVisibility()
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(LS_KEY) || "null")
    if (stored && typeof stored === "object") {
      for (const c of COLS) {
        const v = (stored as Record<string, unknown>)[c.id]
        if (typeof v === "boolean") result[c.id] = v
      }
    }
  } catch {
    /* ignore corrupt or unavailable storage */
  }
  return result
}

function saveVisibility(v: ColumnVisibility) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(v))
  } catch {
    /* storage may be unavailable */
  }
}

// 1 … current-1 current current+1 … last, constant width (7 slots) once there are many pages.
function pageItems(current: number, total: number): (number | "gap-l" | "gap-r")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, "gap-r", total]
  if (current >= total - 3) {
    return [1, "gap-l", total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, "gap-l", current - 1, current, current + 1, "gap-r", total]
}

const Dashes: React.FC = () => <Dash>—</Dash>

const CheckCell: React.FC<{ yes: boolean }> = ({ yes }) => (
  <Check $yes={yes} role="img" aria-label={yes ? "Sí" : "No"} title={yes ? "Sí" : "No"}>
    {yes && <CheckIcon size={12} strokeWidth={3} />}
  </Check>
)

const TextOrDash: React.FC<{ value: string | null }> = ({ value }) =>
  hasText(value) ? <>{value}</> : <Dashes />

interface PaginationProps {
  page: number
  limit: number
  total: number
  onPage: (p: number) => void
  onLimit: (l: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ page, limit, total, onPage, onLimit }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <PaginationBar>
      <span>{total === 0 ? "Sin resultados" : `Mostrando ${from}-${to} de ${total}`}</span>
      <PaginationPages>
        <PageButton
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeftIcon size={14} />
        </PageButton>
        {pageItems(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <PageButton
              key={item}
              type="button"
              $current={item === page}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPage(item)}
            >
              {item}
            </PageButton>
          ) : (
            <Ellipsis key={item}>…</Ellipsis>
          )
        )}
        <PageButton
          type="button"
          aria-label="Página siguiente"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRightIcon size={14} />
        </PageButton>
      </PaginationPages>
      <Select
        $compact
        aria-label="Filas por página"
        value={limit}
        onChange={(e) => onLimit(Number(e.target.value))}
      >
        {PAGE_SIZES.map((n) => (
          <option key={n} value={n}>
            {n} por página
          </option>
        ))}
      </Select>
    </PaginationBar>
  )
}

export const AdminStyleTest: React.FC = () => {
  // Filters
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [source, setSource] = useState("")
  const [gender, setGender] = useState("")
  const [sort, setSort] = useState<SortState>({ col: "date", dir: "desc" })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0])

  // UI state
  const [visible, setVisible] = useState<ColumnVisibility>(loadVisibility)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  // Data
  const [stats, setStats] = useState<Stats | null>(null)
  const [loaded, setLoaded] = useState<LoadedList | null>(null)

  // Debounce the text search; reset to page 1 when the applied value changes.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [search])

  // Filters + sort, without pagination. Used for the list and, as-is, for the CSV export.
  const filterQs = useMemo(() => {
    const p = new URLSearchParams()
    const q = debouncedSearch.trim()
    if (q) p.set("q", q)
    if (from) p.set("from", from)
    if (to) p.set("to", to)
    if (source) p.set("source", source)
    if (gender) p.set("gender", gender)
    p.set("sort", `${sort.col}:${sort.dir}`)
    return p.toString()
  }, [debouncedSearch, from, to, source, gender, sort])

  const listQs = `${filterQs}&page=${page}&limit=${limit}`

  useEffect(() => {
    let cancelled = false
    apiFetch<Stats>("/api/admin/style-test/stats")
      .then((s) => {
        if (!cancelled) setStats(s)
      })
      .catch(() => {
        /* tiles fall back to a dash */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    apiFetch<ListResponse>(`/api/admin/style-test?${listQs}`)
      .then((res) => {
        if (cancelled) return
        setLoaded({ key: listQs, rows: res.rows, total: res.total, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setLoaded({
          key: listQs,
          rows: [],
          total: 0,
          error: err instanceof Error ? err.message : "Error cargando respuestas",
        })
      })
    return () => {
      cancelled = true
    }
  }, [listQs])

  const loading = loaded?.key !== listQs
  const rows = useMemo(() => loaded?.rows ?? [], [loaded])
  const total = loaded?.total ?? 0

  // Drawer: selection is by id, navigation is index-based within the loaded page.
  const selectedIndex = selectedId === null ? -1 : rows.findIndex((r) => r.id === selectedId)
  const detail = selectedIndex >= 0 ? rows[selectedIndex] : null
  const closeDrawer = useCallback(() => setSelectedId(null), [])
  const goPrev = () => {
    if (selectedIndex > 0) setSelectedId(rows[selectedIndex - 1].id)
  }
  const goNext = () => {
    if (selectedIndex >= 0 && selectedIndex < rows.length - 1) {
      setSelectedId(rows[selectedIndex + 1].id)
    }
  }

  const resetPage = () => setPage(1)

  const toggleSort = (col: string) => {
    setSort((s) =>
      s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: "asc" }
    )
    resetPage()
  }

  const toggleColumn = (id: string, value: boolean) => {
    const next = { ...visible, [id]: value }
    setVisible(next)
    saveVisibility(next)
  }

  const resetColumns = () => {
    const next = defaultVisibility()
    setVisible(next)
    saveVisibility(next)
  }

  const handleExport = async () => {
    setExporting(true)
    setExportError(null)
    try {
      const token = getToken()
      const response = await fetch(`/api/admin/style-test/export?${filterQs}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!response.ok) throw new Error(`Error al exportar (${response.status})`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `style-test-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Error al exportar")
    } finally {
      setExporting(false)
    }
  }

  const colProps = (id: string) => ({
    "data-col": id,
    className: visible[id] === false ? "is-hidden" : undefined,
  })

  const renderSortIcon = (col: string) => {
    if (sort.col !== col) return <SortNeutralIcon size={12} />
    return sort.dir === "asc" ? <SortAscIcon size={12} /> : <SortDescIcon size={12} />
  }

  const error = loaded?.error ?? exportError

  return (
    <Container>
      <PageTitle>Style test results</PageTitle>

      <Metrics>
        <Metric>
          <MetricLabel>Total respuestas</MetricLabel>
          <MetricValue>{stats ? stats.total : "—"}</MetricValue>
          <MetricSub>
            {stats ? (
              <>
                <strong>+{stats.lastWeek}</strong> esta semana
              </>
            ) : (
              " "
            )}
          </MetricSub>
        </Metric>
        <Metric>
          <MetricLabel>Últimos 30 días</MetricLabel>
          <MetricValue>{stats ? stats.lastMonth : "—"}</MetricValue>
          <MetricSub>ventana móvil de 30 días</MetricSub>
        </Metric>
        <Metric>
          <MetricLabel>Opt-in comunicaciones</MetricLabel>
          <MetricValue>{stats ? `${stats.optInCommsPct}%` : "—"}</MetricValue>
          <MetricSub>
            {stats ? (
              <>
                <strong>{stats.optInCommsCount}</strong> de {stats.total}
              </>
            ) : (
              " "
            )}
          </MetricSub>
        </Metric>
        <Metric>
          <MetricLabel>Estilo más frecuente</MetricLabel>
          <MetricValue $small>{stats ? (stats.topStyle?.name ?? "—") : "—"}</MetricValue>
          <MetricSub>
            {stats?.topStyle ? (
              <>
                <strong>{stats.topStyle.pct}%</strong> lo recibió
              </>
            ) : (
              " "
            )}
          </MetricSub>
        </Metric>
      </Metrics>

      <FiltersBar>
        <SearchWrap>
          <SearchIcon />
          <SearchInput
            type="search"
            placeholder="Buscar por nombre o email…"
            aria-label="Buscar por nombre o email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchWrap>

        <DateRange>
          <CalendarIcon />
          <input
            type="date"
            aria-label="Desde"
            value={from}
            max={to || undefined}
            onChange={(e) => {
              setFrom(e.target.value)
              resetPage()
            }}
          />
          <DateSep aria-hidden="true">→</DateSep>
          <input
            type="date"
            aria-label="Hasta"
            value={to}
            min={from || undefined}
            onChange={(e) => {
              setTo(e.target.value)
              resetPage()
            }}
          />
        </DateRange>

        <Select
          aria-label="Origen"
          value={source}
          onChange={(e) => {
            setSource(e.target.value)
            resetPage()
          }}
        >
          <option value="">Todos los orígenes</option>
          <option value="app">App (nuevos)</option>
          <option value="notion-import">Notion (histórico)</option>
        </Select>

        <Select
          aria-label="Género"
          value={gender}
          onChange={(e) => {
            setGender(e.target.value)
            resetPage()
          }}
        >
          <option value="">Todos los géneros</option>
          <option value="mujer">mujer</option>
          <option value="hombre">hombre</option>
          <option value="no-binario">no-binario</option>
          <option value="prefiero-no-decir">prefiero-no-decir</option>
          <option value="otro">otro</option>
        </Select>

        <ColumnsMenu
          columns={COLS}
          visible={visible}
          onToggle={toggleColumn}
          onReset={resetColumns}
        />

        <ExportButton type="button" onClick={handleExport} disabled={exporting}>
          <DownloadIcon />
          {exporting ? "Exportando…" : "Exportar CSV"}
        </ExportButton>
      </FiltersBar>

      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

      <TableWrap>
        <TableScroll $loading={loading} aria-busy={loading}>
          <DataTable>
            <thead>
              <tr>
                {COLS.map((c) => {
                  const sorted = sort.col === c.id
                  const classes = [
                    c.sortable ? "sortable" : "",
                    sorted ? "is-sorted" : "",
                    visible[c.id] === false ? "is-hidden" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                  return (
                    <th
                      key={c.id}
                      data-col={c.id}
                      className={classes || undefined}
                      aria-sort={
                        sorted ? (sort.dir === "asc" ? "ascending" : "descending") : undefined
                      }
                      tabIndex={c.sortable ? 0 : undefined}
                      onClick={c.sortable ? () => toggleSort(c.id) : undefined}
                      onKeyDown={
                        c.sortable
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                toggleSort(c.id)
                              }
                            }
                          : undefined
                      }
                    >
                      <span className="colhead">
                        <span>{c.label}</span>
                        {c.sortable && <span className="sorticon">{renderSortIcon(c.id)}</span>}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className={r.id === selectedId ? "is-selected" : undefined}
                  tabIndex={0}
                  onClick={() => setSelectedId(r.id)}
                  onKeyDown={(e) => {
                    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault()
                      setSelectedId(r.id)
                    }
                  }}
                >
                  <td {...colProps("date")}>
                    <CellDate>{formatDateTime(r.submittedAt)}</CellDate>
                  </td>
                  <td {...colProps("name")}>
                    <strong>{hasText(r.nombre) ? r.nombre : "—"}</strong>
                  </td>
                  <td {...colProps("lastname")}>
                    <TextOrDash value={r.apellido} />
                  </td>
                  <td {...colProps("email")}>
                    <CellNowrap $secondary>{r.email || "—"}</CellNowrap>
                  </td>
                  <td {...colProps("gender")}>
                    {hasText(r.genero) ? <Chip value={r.genero} /> : <Dashes />}
                  </td>
                  <td {...colProps("location")}>
                    <TextOrDash value={r.ubicacion} />
                  </td>
                  <td {...colProps("place")}>
                    <TextOrDash value={r.place} />
                  </td>
                  <td {...colProps("personality")}>
                    <ChipsWrap>
                      {r.personalidad.map((p) => (
                        <Chip key={p} value={p} />
                      ))}
                    </ChipsWrap>
                  </td>
                  <td {...colProps("characteristics")}>
                    <CellText>
                      {hasText(r.caracteristicas) ? r.caracteristicas.replace(/\n/g, " · ") : "—"}
                    </CellText>
                  </td>
                  <td {...colProps("time")}>
                    {hasText(r.tiempo) ? <Chip value={r.tiempo} variant="subtle" /> : <Dashes />}
                  </td>
                  <td {...colProps("fit")}>
                    {hasText(r.fit) ? <Chip value={r.fit} variant="subtle" /> : <Dashes />}
                  </td>
                  <td {...colProps("results")}>
                    <ChipsWrap>
                      {r.results.map((res) => (
                        <Chip key={res} value={res} />
                      ))}
                    </ChipsWrap>
                  </td>
                  <td {...colProps("sugerencia")}>
                    <CellText>{hasText(r.sugerencia) ? r.sugerencia : "—"}</CellText>
                  </td>
                  <td {...colProps("comms")}>
                    <CheckCell yes={r.comunicaciones} />
                  </td>
                  <td {...colProps("dataproc")}>
                    <CheckCell yes={r.procesamiento} />
                  </td>
                  <td {...colProps("iplocation")}>
                    <TextOrDash value={r.ipLocation} />
                  </td>
                  <td {...colProps("source")}>
                    <Chip
                      value={r.source}
                      variant={r.source === "app" ? "source-app" : "source-notion"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          {loading && rows.length === 0 && <StatusMessage>Cargando…</StatusMessage>}
          {!loading && rows.length === 0 && !loaded?.error && (
            <StatusMessage>No hay respuestas que coincidan con los filtros.</StatusMessage>
          )}
        </TableScroll>
        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPage={setPage}
          onLimit={(l) => {
            setLimit(l)
            resetPage()
          }}
        />
      </TableWrap>

      <StyleTestDrawer
        row={detail}
        onClose={closeDrawer}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex >= 0 && selectedIndex < rows.length - 1}
      />
    </Container>
  )
}
