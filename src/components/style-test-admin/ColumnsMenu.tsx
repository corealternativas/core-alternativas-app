import React, { useEffect, useRef, useState } from "react"
import { ColumnsIcon } from "./icons"
import type { ColumnDef, ColumnVisibility } from "./types"
import {
  ColsMenuWrap,
  ColsMenuButton,
  ColsMenuPanel,
  ColsMenuHead,
  ColsMenuItem,
} from "./ColumnsMenu.style"

interface ColumnsMenuProps {
  columns: readonly ColumnDef[]
  visible: ColumnVisibility
  onToggle: (id: string, value: boolean) => void
  onReset: () => void
}

export const ColumnsMenu: React.FC<ColumnsMenuProps> = ({
  columns,
  visible,
  onToggle,
  onReset,
}) => {
  const [open, setOpen] = useState(false)
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
            <span>Mostrar columnas</span>
            <button type="button" onClick={onReset}>
              Reset
            </button>
          </ColsMenuHead>
          {columns.map((c) => (
            <ColsMenuItem key={c.id}>
              <input
                type="checkbox"
                checked={visible[c.id] !== false}
                onChange={(e) => onToggle(c.id, e.target.checked)}
              />
              <span>{c.label}</span>
            </ColsMenuItem>
          ))}
        </ColsMenuPanel>
      )}
    </ColsMenuWrap>
  )
}
