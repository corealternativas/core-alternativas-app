import React, { useCallback, useEffect, useRef } from "react"
import {
  CATEGORIES_BY_CODE,
  DAY_LABELS,
  DAYS,
  HOURS,
  type Cell,
  type CategoryCode,
  type Grid,
} from "../../domain/categories"
import { CategoryIcon } from "../Icons/CategoryIcon"
import {
  StyledWrapper,
  StyledTable,
  StyledHourCell,
  StyledDataCell,
  StyledHeaderCell,
  StyledCornerCell,
} from "./HourGrid.style"

interface HourGridProps {
  cells: Grid
  onChange?: (cells: Grid) => void
  activeCategory?: CategoryCode | null
  readOnly?: boolean
}

function formatHour(h: number): string {
  return `${h.toString().padStart(2, "0")}:00`
}

const TAP_MAX_DISTANCE = 10 // px — anything above is treated as a scroll, not a tap

export const HourGrid: React.FC<HourGridProps> = ({
  cells,
  onChange,
  activeCategory,
  readOnly,
}) => {
  const draggingRef = useRef(false)
  const lastKeyRef = useRef<string | null>(null)
  const touchStartRef = useRef<{ x: number; y: number; key: string } | null>(null)

  const applyToCell = useCallback(
    (d: number, h: number) => {
      if (readOnly || !onChange) return
      if (cells[d]?.[h] === (activeCategory ?? null)) return
      const next = cells.map((row) => row.slice()) as Grid
      next[d][h] = (activeCategory ?? null) as Cell
      onChange(next)
    },
    [cells, onChange, activeCategory, readOnly]
  )

  const applyToRow = useCallback(
    (h: number) => {
      if (readOnly || !onChange) return
      const value = (activeCategory ?? null) as Cell
      const next = cells.map((row) => row.slice()) as Grid
      for (let d = 0; d < DAYS; d++) next[d][h] = value
      onChange(next)
    },
    [cells, onChange, activeCategory, readOnly]
  )

  const applyToColumn = useCallback(
    (d: number) => {
      if (readOnly || !onChange) return
      const value = (activeCategory ?? null) as Cell
      const next = cells.map((row) => row.slice()) as Grid
      for (let h = 0; h < HOURS; h++) next[d][h] = value
      onChange(next)
    },
    [cells, onChange, activeCategory, readOnly]
  )

  const startPaint = (d: number, h: number, key: string) => {
    if (readOnly) return
    draggingRef.current = true
    lastKeyRef.current = key
    applyToCell(d, h)
  }

  const continuePaint = (d: number, h: number, key: string) => {
    if (!draggingRef.current) return
    if (lastKeyRef.current === key) return
    lastKeyRef.current = key
    applyToCell(d, h)
  }

  useEffect(() => {
    const stop = () => {
      draggingRef.current = false
      lastKeyRef.current = null
    }
    window.addEventListener("mouseup", stop)
    window.addEventListener("touchend", stop)
    window.addEventListener("touchcancel", stop)
    return () => {
      window.removeEventListener("mouseup", stop)
      window.removeEventListener("touchend", stop)
      window.removeEventListener("touchcancel", stop)
    }
  }, [])

  return (
    <StyledWrapper $readOnly={!!readOnly}>
      <StyledTable>
        <thead>
          <tr>
            <StyledCornerCell />
            {DAY_LABELS.map((day, d) => (
              <StyledHeaderCell
                key={day}
                $clickable={!readOnly}
                onClick={readOnly ? undefined : () => applyToColumn(d)}
                data-tooltip={readOnly ? undefined : "Seleccionar toda la columna"}
              >
                {day}
              </StyledHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: HOURS }, (_, h) => (
            <tr key={h}>
              <StyledHourCell
                $clickable={!readOnly}
                onClick={readOnly ? undefined : () => applyToRow(h)}
                data-tooltip={readOnly ? undefined : "Seleccionar toda la fila"}
              >
                {formatHour(h)}
              </StyledHourCell>
              {Array.from({ length: DAYS }, (_, d) => {
                const value = cells[d]?.[h] ?? null
                const cat = value ? CATEGORIES_BY_CODE[value] : null
                const key = `cell-${d}-${h}`
                return (
                  <StyledDataCell
                    key={key}
                    data-cell-key={key}
                    $color={cat?.color}
                    $readOnly={!!readOnly}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      startPaint(d, h, key)
                    }}
                    onMouseEnter={() => continuePaint(d, h, key)}
                    onTouchStart={
                      readOnly
                        ? undefined
                        : (e) => {
                            const t = e.touches[0]
                            if (!t) return
                            touchStartRef.current = { x: t.clientX, y: t.clientY, key }
                          }
                    }
                    onTouchEnd={
                      readOnly
                        ? undefined
                        : (e) => {
                            const start = touchStartRef.current
                            touchStartRef.current = null
                            if (!start || start.key !== key) return
                            const t = e.changedTouches[0]
                            if (!t) return
                            const dx = Math.abs(t.clientX - start.x)
                            const dy = Math.abs(t.clientY - start.y)
                            /* Only treat as tap-to-paint when the finger barely moved;
                               otherwise the user was scrolling and we leave the grid alone. */
                            if (dx > TAP_MAX_DISTANCE || dy > TAP_MAX_DISTANCE) return
                            e.preventDefault()
                            applyToCell(d, h)
                          }
                    }
                    onTouchCancel={
                      readOnly
                        ? undefined
                        : () => {
                            touchStartRef.current = null
                          }
                    }
                    aria-label={cat ? cat.label : "sin asignar"}
                  >
                    {value && <CategoryIcon code={value} size={16} />}
                  </StyledDataCell>
                )
              })}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledWrapper>
  )
}
