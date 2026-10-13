import React, { useEffect, useMemo, useRef, useState } from "react"
import { apiFetch } from "../services/services"
import { useAuth } from "../context/AuthContext"
import { ExportableReport } from "../components/ExportableReport/ExportableReport"
import { exportNodeAsPng } from "../utils/exportImage"
import {
  cloneGrid,
  computeStats,
  emptyGrid,
  type CategoryCode,
  type Grid,
} from "../domain/categories"
import { CategoryPicker } from "../components/CategoryPicker/CategoryPicker"
import { HourGrid } from "../components/HourGrid/HourGrid"
import { SummaryPanel } from "../components/SummaryPanel/SummaryPanel"
import { ResultChart } from "../components/ResultChart/ResultChart"
import { Button } from "../components/Button/Button"
import { ConfirmModal } from "../components/ConfirmModal/ConfirmModal"
import { DownloadIcon } from "../components/Icons/CategoryIcon"
import {
  StyledHeader,
  StyledTitle,
  StyledStatus,
  StyledLayout,
  StyledLeft,
  StyledRight,
  StyledChartCard,
  StyledToolbar,
  StyledError,
  StyledOffscreen,
} from "./Calculator.style"

interface CalculationResponse {
  cells: Grid
  updated_at: string | null
  created_at: string | null
  exists: boolean
}

function gridsEqual(a: Grid, b: Grid): boolean {
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      if ((a[d]?.[h] ?? null) !== (b[d]?.[h] ?? null)) return false
    }
  }
  return true
}

export const Calculator: React.FC = () => {
  const { user } = useAuth()
  const [grid, setGrid] = useState<Grid>(() => emptyGrid())
  const [savedGrid, setSavedGrid] = useState<Grid>(() => emptyGrid())
  const [activeCategory, setActiveCategory] = useState<CategoryCode | null>("A")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [clearOpen, setClearOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiFetch<CalculationResponse>("/api/calculations/me")
        if (cancelled) return
        setGrid(cloneGrid(data.cells))
        setSavedGrid(cloneGrid(data.cells))
        setLastSaved(data.updated_at)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error cargando datos")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => computeStats(grid), [grid])
  const dirty = useMemo(() => !gridsEqual(grid, savedGrid), [grid, savedGrid])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const data = await apiFetch<CalculationResponse>("/api/calculations/me", {
        method: "PUT",
        body: JSON.stringify({ cells: grid }),
      })
      setSavedGrid(cloneGrid(data.cells))
      setLastSaved(data.updated_at)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando")
    } finally {
      setSaving(false)
    }
  }

  const confirmClear = () => {
    setGrid(emptyGrid())
    setClearOpen(false)
  }

  const handleExport = async () => {
    if (!reportRef.current) return
    setExporting(true)
    setError(null)
    try {
      const who = user?.name || user?.email || "mi-semana"
      const date = new Date().toISOString().slice(0, 10)
      await exportNodeAsPng(reportRef.current, {
        filename: `semana-${who}-${date}`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al exportar")
    } finally {
      setExporting(false)
    }
  }

  const statusText = saving
    ? "Guardando…"
    : dirty
      ? "Sin guardar"
      : lastSaved
        ? `Guardado ${new Date(lastSaved).toLocaleString()}`
        : "Sin datos guardados"

  if (loading) {
    return <div>Cargando…</div>
  }

  return (
    <div>
      <StyledHeader>
        <div>
          <StyledTitle>Tu semana</StyledTitle>
          <StyledStatus $dirty={dirty}>{statusText}</StyledStatus>
        </div>
      </StyledHeader>

      {error && <StyledError>{error}</StyledError>}

      <CategoryPicker active={activeCategory} onChange={setActiveCategory} />

      <StyledLayout>
        <StyledLeft>
          <HourGrid
            cells={grid}
            onChange={setGrid}
            activeCategory={activeCategory}
          />
        </StyledLeft>
        <StyledRight>
          <StyledChartCard>
            <ResultChart stats={stats} />
          </StyledChartCard>
          <SummaryPanel stats={stats} />
        </StyledRight>
      </StyledLayout>

      <StyledToolbar>
        <Button variant="outline" onClick={() => setClearOpen(true)} disabled={saving}>
          Limpiar todo
        </Button>
        <Button
          onClick={handleExport}
          loading={exporting}
          disabled={exporting || stats.totalAssigned === 0}
        >
          <DownloadIcon size={16} />
          Descargar resultado
        </Button>
        <Button onClick={handleSave} loading={saving} disabled={!dirty || saving}>
          Guardar
        </Button>
      </StyledToolbar>

      <StyledOffscreen aria-hidden="true">
        <ExportableReport
          ref={reportRef}
          title={`Semana de ${user?.name || user?.email || "usuario"}`}
          subtitle={lastSaved ? `Actualizado ${new Date(lastSaved).toLocaleString()}` : undefined}
          grid={grid}
          stats={stats}
          footnote="Generado con CORE Clothes — Calculadora semana de uso de ropa"
        />
      </StyledOffscreen>

      <ConfirmModal
        open={clearOpen}
        title="Limpiar semana"
        message="Vas a borrar todas las horas cargadas. Esta acción no se puede deshacer hasta guardar de nuevo."
        confirmLabel="Sí, limpiar"
        cancelLabel="Cancelar"
        onConfirm={confirmClear}
        onCancel={() => setClearOpen(false)}
      />
    </div>
  )
}
