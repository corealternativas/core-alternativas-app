import React, { useEffect, useState } from "react"
import { FormInput } from "../FormInput/FormInput"
import { FormModal } from "../FormModal/FormModal"
import { apiFetch } from "../../services/services"

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setError(null)
      setSubmitting(false)
    }
  }, [open])

  const handleSubmit = async () => {
    setError(null)
    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("La confirmación no coincide")
      return
    }
    if (newPassword === currentPassword) {
      setError("La nueva contraseña debe ser distinta a la actual")
      return
    }
    setSubmitting(true)
    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      onClose()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cambiando la contraseña")
    } finally {
      setSubmitting(false)
    }
  }

  const disable =
    currentPassword.length === 0 ||
    newPassword.length < 6 ||
    confirmPassword.length < 6

  return (
    <FormModal
      open={open}
      title="Cambiar contraseña"
      message="Ingresá tu contraseña actual y la nueva."
      confirmLabel="Actualizar"
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
      disableConfirm={disable}
      error={error}
    >
      <FormInput
        label="Contraseña actual"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        autoFocus
        required
      />
      <FormInput
        label="Nueva contraseña (mínimo 6 caracteres)"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={6}
      />
      <FormInput
        label="Repetí la nueva contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={6}
      />
    </FormModal>
  )
}
