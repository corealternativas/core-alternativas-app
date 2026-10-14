import React, { useEffect, useRef, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon, ColumnsIcon, GripIcon } from "./icons"
import type { ColumnDef, ColumnVisibility } from "./types"
import {
  ColsMenuWrap,
  ColsMenuButton,
  ColsMenuPanel,
  ColsMenuHead,
  ColsMenuRow,
  ColsMenuHandle,
  ColsMenuLabel,
  ColsMenuArrows,
  ColsMenuArrow,
} from "./ColumnsMenu.style"

interface ColumnsMenuProps {
  /** Columns in their current display order. */
  columns: readonly ColumnDef[]
  visible: ColumnVisibility
  onToggle: (id: string, value: boolean) => void
  /** Emits the full new order (list of column ids). */
  onReorder: (order: string[]) => void
  onReset: () => void
}

type DropPos = "before" | "after"
interface DropTarget {
  id: string
  pos: DropPos
}

// Touch-first devices get up/down buttons: HTML5 drag-and-drop is flaky there.
// Desktop (pointer: fine) keeps native drag, even if a touchscreen is also present.
function prefersCoarsePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  )
}

export const ColumnsMenu: React.FC<ColumnsMenuProps> = ({
  columns,
  visible,
  onToggle,
  onReorder,
  onReset,
}) => {
  const [open, setOpen] = useState(false)
  const [coarse] = useState(prefersCoarsePointer)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("click", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("click", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const clearDrag = () => {
    setDragId(null)
    setDropTarget(null)
  }

  // Moves `fromId` next to `toId` (before/after it) and emits the new order.
  const moveColumn = (fromId: string, toId: string, pos: DropPos) => {
    if (fromId === toId) return
    const ids = columns.map((c) => c.id)
    const without = ids.filter((id) => id !== fromId)
    const toIdx = without.indexOf(toId)
    if (toIdx < 0 || !ids.includes(fromId)) return
    without.splice(pos === "before" ? toIdx : toIdx + 1, 0, fromId)
    if (without.every((id, i) => id === ids[i])) return
    onReorder(without)
  }

  const moveBy = (index: number, delta: -1 | 1) => {
    const target = columns[index + delta]
    if (!target) return
    moveColumn(columns[index].id, target.id, delta < 0 ? "before" : "after")
  }

  const dropPosFor = (e: React.DragEvent<HTMLDivElement>): DropPos => {
    const rect = e.currentTarget.getBoundingClientRect()
    return e.clientY < rect.top + rect.height / 2 ? "before" : "after"
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id)
    e.dataTransfer.effectAllowed = "move"
    setDragId(id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    if (dragId === null) return // not one of our rows (e.g. dragged text/file)
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    const pos = dropPosFor(e)
    setDropTarget((prev) => (prev?.id === id && prev.pos === pos ? prev : { id, pos }))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault()
    const fromId = e.dataTransfer.getData("text/plain") || dragId
    if (fromId) moveColumn(fromId, id, dropPosFor(e))
    clearDrag()
  }

  return (
    <ColsMenuWrap ref={wrapRef}>
      <ColsMenuButton
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ColumnsIcon />
        Columnas
      </ColsMenuButton>
      {open && (
        <ColsMenuPanel role="menu">
          <ColsMenuHead>
            <span>Mostrar y ordenar</span>
            <button type="button" onClick={onReset}>
              Reset
            </button>
          </ColsMenuHead>
          {columns.map((c, i) => (
            <ColsMenuRow
              key={c.id}
              draggable={!coarse}
              $dragging={dragId === c.id}
              $drop={dropTarget?.id === c.id ? dropTarget.pos : null}
              onDragStart={coarse ? undefined : (e) => handleDragStart(e, c.id)}
              onDragOver={coarse ? undefined : (e) => handleDragOver(e, c.id)}
              onDrop={coarse ? undefined : (e) => handleDrop(e, c.id)}
              onDragEnd={coarse ? undefined : clearDrag}
            >
              {!coarse && (
                <ColsMenuHandle aria-hidden="true" title="Arrastrar para reordenar">
                  <GripIcon size={14} />
                </ColsMenuHandle>
              )}
              <ColsMenuLabel>
                <input
                  type="checkbox"
                  checked={visible[c.id] !== false}
                  onChange={(e) => onToggle(c.id, e.target.checked)}
                />
                <span>{c.label}</span>
              </ColsMenuLabel>
              {coarse && (
                <ColsMenuArrows>
                  <ColsMenuArrow
                    type="button"
                    aria-label={`Subir ${c.label}`}
                    disabled={i === 0}
                    onClick={() => moveBy(i, -1)}
                  >
                    <ChevronUpIcon size={14} />
                  </ColsMenuArrow>
                  <ColsMenuArrow
                    type="button"
                    aria-label={`Bajar ${c.label}`}
                    disabled={i === columns.length - 1}
                    onClick={() => moveBy(i, 1)}
                  >
                    <ChevronDownIcon size={14} />
                  </ColsMenuArrow>
                </ColsMenuArrows>
              )}
            </ColsMenuRow>
          ))}
        </ColsMenuPanel>
      )}
    </ColsMenuWrap>
  )
}
