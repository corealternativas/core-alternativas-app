import React, { useEffect } from "react"
import { Button } from "../Button/Button"
import {
  StyledOverlay,
  StyledCard,
  StyledHeader,
  StyledTitle,
  StyledClose,
  StyledMessage,
  StyledBody,
  StyledActions,
  StyledError,
} from "./FormModal.style"

interface FormModalProps {
  open: boolean
  title: string
  message?: React.ReactNode
  error?: string | null
  confirmLabel?: string
  cancelLabel?: string
  submitting?: boolean
  disableConfirm?: boolean
  onSubmit: () => void
  onCancel: () => void
  children?: React.ReactNode
}

export const FormModal: React.FC<FormModalProps> = ({
  open,
  title,
  message,
  error,
  confirmLabel = "Guardar",
  cancelLabel = "Cancelar",
  submitting = false,
  disableConfirm = false,
  onSubmit,
  onCancel,
  children,
}) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onCancel])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || disableConfirm) return
    onSubmit()
  }

  return (
    <StyledOverlay onClick={onCancel}>
      <StyledCard
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <StyledHeader>
          <StyledTitle>{title}</StyledTitle>
          <StyledClose type="button" onClick={onCancel} aria-label="Cerrar">
            ✕
          </StyledClose>
        </StyledHeader>
        {message && <StyledMessage>{message}</StyledMessage>}
        <form onSubmit={handleSubmit}>
          <StyledBody>{children}</StyledBody>
          {error && <StyledError>{error}</StyledError>}
          <StyledActions>
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              {cancelLabel}
            </Button>
            <Button type="submit" loading={submitting} disabled={submitting || disableConfirm}>
              {confirmLabel}
            </Button>
          </StyledActions>
        </form>
      </StyledCard>
    </StyledOverlay>
  )
}
