import React, { useEffect } from "react"
import { Button } from "../Button/Button"
import {
  StyledOverlay,
  StyledCard,
  StyledTitle,
  StyledMessage,
  StyledActions,
} from "./ConfirmModal.style"

interface ConfirmModalProps {
  open: boolean
  title: string
  message?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
      if (e.key === "Enter") onConfirm()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onCancel, onConfirm])

  if (!open) return null

  return (
    <StyledOverlay onClick={onCancel}>
      <StyledCard onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <StyledTitle>{title}</StyledTitle>
        {message && <StyledMessage>{message}</StyledMessage>}
        <StyledActions>
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </Button>
        </StyledActions>
      </StyledCard>
    </StyledOverlay>
  )
}
