import React, { useEffect, useRef, useState } from "react"
import { apiFetch } from "../services/services"
import {
  cloneGrid,
  computeStats,
  emptyGrid,
  type Grid,
} from "../domain/categories"
import { HourGrid } from "../components/HourGrid/HourGrid"
import { SummaryPanel } from "../components/SummaryPanel/SummaryPanel"
import { ResultChart } from "../components/ResultChart/ResultChart"
import { Button } from "../components/Button/Button"
import { ExportableReport } from "../components/ExportableReport/ExportableReport"
import { exportNodeAsPng } from "../utils/exportImage"
import { DownloadIcon } from "../components/Icons/CategoryIcon"
import {
  StyledTitle,
  StyledTableWrapper,
  StyledTable,
  StyledStatus,
  StyledEmpty,
  StyledError,
  StyledModal,
  StyledModalContent,
  StyledModalHeader,
  StyledModalActions,
  StyledDetailLayout,
  StyledDetailChart,
  StyledOffscreen,
} from "./AdminResults.style"

interface UserWithCalc {
  user_id: string
  email: string
  name: string | null
  role: string
  active: boolean
  calculation_updated_at: string | null
  has_calc: boolean
}

interface CalcDetail {
  user: {
    id: string
    email: string
    name: string | null
    role: string
    active: boolean
    created_at: string
    last_login_at: string | null
  }
  calculation: {
    cells: Grid
    updated_at: string
    created_at: string
  } | null
}

export const AdminResults: React.FC = () => {
  const [users, setUsers] = useState<UserWithCalc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<CalcDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const load = async () => {
    try {
      setError(null)
      const data = await apiFetch<UserWithCalc[]>("/api/admin/calculations")
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando usuarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openDetail = async (userId: string) => {
    setDetailLoading(true)
    setError(null)
    try {
      const data = await apiFetch<CalcDetail>(`/api/admin/calculations/${userId}`)
      setDetail(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando detalle")
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetail = () => setDetail(null)

  const detailGrid: Grid = detail?.calculation ? cloneGrid(detail.calculation.cells) : emptyGrid()
  const detailStats = computeStats(detailGrid)

  const handleExport = async () => {
    if (!reportRef.current || !detail) return
    setExporting(true)
    setError(null)
    try {
      const who = detail.user.name || detail.user.email
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

  return (
    <div>
      <StyledTitle>Resultados de usuarios</StyledTitle>

      {error && <StyledError>{error}</StyledError>}

      {loading ? (
        <StyledEmpty>Cargando…</StyledEmpty>
      ) : users.length === 0 ? (
        <StyledEmpty>No hay usuarios registrados.</StyledEmpty>
      ) : (
        <StyledTableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Cálculo</th>
                <th>Última actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Nombre">{u.name || "—"}</td>
                  <td data-label="Cálculo">
                    <StyledStatus $active={u.has_calc}>
                      {u.has_calc ? "Cargado" : "Vacío"}
                    </StyledStatus>
                  </td>
                  <td data-label="Última actualización">
                    {u.calculation_updated_at
                      ? new Date(u.calculation_updated_at).toLocaleString()
                      : "—"}
                  </td>
                  <td data-label="Acciones">
                    <Button
                      variant="outline"
                      onClick={() => openDetail(u.user_id)}
                      disabled={!u.has_calc}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </StyledTableWrapper>
      )}

      {detail && (
        <StyledModal onClick={closeDetail}>
          <StyledModalContent onClick={(e) => e.stopPropagation()}>
            <StyledModalHeader>
              <div>
                <h2>{detail.user.email}</h2>
                {detail.user.name && <p>{detail.user.name}</p>}
              </div>
              <StyledModalActions>
                <Button
                  onClick={handleExport}
                  loading={exporting}
                  disabled={exporting || detailStats.totalAssigned === 0}
                >
                  <DownloadIcon size={16} />
                  Descargar resultado
                </Button>
                <button onClick={closeDetail} aria-label="Cerrar">✕</button>
              </StyledModalActions>
            </StyledModalHeader>

            {detailLoading ? (
              <StyledEmpty>Cargando…</StyledEmpty>
            ) : (
              <StyledDetailLayout>
                <HourGrid cells={detailGrid} readOnly />
                <div>
                  <StyledDetailChart>
                    <ResultChart stats={detailStats} />
                  </StyledDetailChart>
                  <SummaryPanel stats={detailStats} />
                </div>
              </StyledDetailLayout>
            )}
          </StyledModalContent>
        </StyledModal>
      )}

      {detail && (
        <StyledOffscreen aria-hidden="true">
          <ExportableReport
            ref={reportRef}
            title={`Semana de ${detail.user.name || detail.user.email}`}
            subtitle={
              detail.calculation
                ? `Actualizado ${new Date(detail.calculation.updated_at).toLocaleString()}`
                : undefined
            }
            grid={detailGrid}
            stats={detailStats}
            footnote="Generado con CORE Clothes — Calculadora semana de uso de ropa"
          />
        </StyledOffscreen>
      )}
    </div>
  )
}
