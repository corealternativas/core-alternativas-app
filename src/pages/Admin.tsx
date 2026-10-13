import React, { useEffect, useState } from "react"
import { apiFetch } from "../services/services"
import type { AuthUser } from "../context/AuthContext"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/Button/Button"
import { FormInput } from "../components/FormInput/FormInput"
import { FormModal } from "../components/FormModal/FormModal"
import { ConfirmModal } from "../components/ConfirmModal/ConfirmModal"
import {
  StyledHeader,
  StyledTitle,
  StyledTable,
  StyledTableWrapper,
  StyledEmpty,
  StyledError,
  StyledInlineActions,
  StyledStatus,
  StyledFieldRow,
  StyledSelect,
} from "./Admin.style"

interface NewUserForm {
  email: string
  password: string
  name: string
  role: "user" | "admin"
}

const emptyForm: NewUserForm = {
  email: "",
  password: "",
  name: "",
  role: "user",
}

type PendingAction =
  | { kind: "toggle-active"; user: AuthUser }
  | { kind: "change-role"; user: AuthUser }
  | { kind: "reset-password"; user: AuthUser }

export const Admin: React.FC = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<NewUserForm>(emptyForm)
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [pending, setPending] = useState<PendingAction | null>(null)
  const [actionSubmitting, setActionSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState("")

  const [flash, setFlash] = useState<string | null>(null)

  const load = async () => {
    try {
      setError(null)
      const data = await apiFetch<AuthUser[]>("/api/admin/users")
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

  const openCreate = () => {
    setCreateForm(emptyForm)
    setCreateError(null)
    setCreateOpen(true)
  }

  const submitCreate = async () => {
    setCreateError(null)
    setCreateSubmitting(true)
    try {
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(createForm),
      })
      setCreateOpen(false)
      await load()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Error creando usuario")
    } finally {
      setCreateSubmitting(false)
    }
  }

  const openAction = (action: PendingAction) => {
    setActionError(null)
    setNewPassword("")
    setPending(action)
  }

  const closeAction = () => {
    if (actionSubmitting) return
    setPending(null)
    setActionError(null)
    setNewPassword("")
  }

  const runAction = async () => {
    if (!pending) return
    setActionError(null)
    setActionSubmitting(true)
    try {
      if (pending.kind === "toggle-active") {
        await apiFetch(`/api/admin/users/${pending.user.id}`, {
          method: "PATCH",
          body: JSON.stringify({ active: !pending.user.active }),
        })
        setFlash(`Usuario ${pending.user.email} ${pending.user.active ? "desactivado" : "activado"}.`)
      } else if (pending.kind === "change-role") {
        const newRole = pending.user.role === "admin" ? "user" : "admin"
        await apiFetch(`/api/admin/users/${pending.user.id}`, {
          method: "PATCH",
          body: JSON.stringify({ role: newRole }),
        })
        setFlash(`Rol de ${pending.user.email} actualizado a "${newRole}".`)
      } else if (pending.kind === "reset-password") {
        if (newPassword.length < 6) {
          setActionError("La contraseña debe tener al menos 6 caracteres")
          setActionSubmitting(false)
          return
        }
        await apiFetch(`/api/admin/users/${pending.user.id}/reset-password`, {
          method: "POST",
          body: JSON.stringify({ password: newPassword }),
        })
        setFlash(`Contraseña de ${pending.user.email} actualizada.`)
      }
      setPending(null)
      setNewPassword("")
      await load()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error ejecutando la acción")
    } finally {
      setActionSubmitting(false)
    }
  }

  useEffect(() => {
    if (!flash) return
    const t = window.setTimeout(() => setFlash(null), 3500)
    return () => window.clearTimeout(t)
  }, [flash])

  return (
    <div>
      <StyledHeader>
        <StyledTitle>Gestión de usuarios</StyledTitle>
        <Button onClick={openCreate}>Nuevo usuario</Button>
      </StyledHeader>

      {error && <StyledError>{error}</StyledError>}
      {flash && <StyledError style={{ background: "#e6f4ea", color: "#1e6f2b" }}>{flash}</StyledError>}

      {loading ? (
        <StyledEmpty>Cargando…</StyledEmpty>
      ) : users.length === 0 ? (
        <StyledEmpty>Sin usuarios aún.</StyledEmpty>
      ) : (
        <StyledTableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último login</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Nombre">{u.name || "—"}</td>
                  <td data-label="Rol">{u.role}</td>
                  <td data-label="Estado">
                    <StyledStatus $active={u.active}>
                      {u.active ? "Activo" : "Inactivo"}
                    </StyledStatus>
                  </td>
                  <td data-label="Último login">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "—"}
                  </td>
                  <td data-label="Acciones">
                    <StyledInlineActions>
                      <button onClick={() => openAction({ kind: "reset-password", user: u })}>
                        Reset pass
                      </button>
                      <button
                        onClick={() => openAction({ kind: "change-role", user: u })}
                        disabled={u.id === currentUser?.id}
                      >
                        {u.role === "admin" ? "Hacer user" : "Hacer admin"}
                      </button>
                      <button
                        onClick={() => openAction({ kind: "toggle-active", user: u })}
                        disabled={u.id === currentUser?.id}
                      >
                        {u.active ? "Desactivar" : "Activar"}
                      </button>
                    </StyledInlineActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </StyledTableWrapper>
      )}

      <FormModal
        open={createOpen}
        title="Nuevo usuario"
        onCancel={() => setCreateOpen(false)}
        onSubmit={submitCreate}
        submitting={createSubmitting}
        confirmLabel="Crear"
        error={createError}
      >
        <FormInput
          label="Email"
          type="email"
          value={createForm.email}
          onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
          required
        />
        <FormInput
          label="Nombre"
          value={createForm.name}
          onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
        />
        <FormInput
          label="Contraseña (mínimo 6 caracteres)"
          type="password"
          value={createForm.password}
          onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
          required
          minLength={6}
        />
        <StyledFieldRow>
          <label htmlFor="role-select">Rol</label>
          <StyledSelect
            id="role-select"
            value={createForm.role}
            onChange={(e) =>
              setCreateForm({ ...createForm, role: e.target.value as "user" | "admin" })
            }
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </StyledSelect>
        </StyledFieldRow>
      </FormModal>

      {/* Reset password modal */}
      <FormModal
        open={pending?.kind === "reset-password"}
        title="Nueva contraseña"
        message={
          pending?.kind === "reset-password"
            ? `Ingresá la nueva contraseña para ${pending.user.email}.`
            : undefined
        }
        onCancel={closeAction}
        onSubmit={runAction}
        submitting={actionSubmitting}
        confirmLabel="Actualizar contraseña"
        error={actionError}
        disableConfirm={newPassword.length < 6}
      >
        <FormInput
          label="Contraseña (mínimo 6 caracteres)"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoFocus
          required
          minLength={6}
        />
      </FormModal>

      {/* Change role confirm */}
      <ConfirmModal
        open={pending?.kind === "change-role"}
        title="Cambiar rol"
        message={
          pending?.kind === "change-role"
            ? `¿Cambiar el rol de ${pending.user.email} a "${pending.user.role === "admin" ? "user" : "admin"}"?`
            : undefined
        }
        confirmLabel="Cambiar rol"
        onConfirm={runAction}
        onCancel={closeAction}
      />

      {/* Toggle active confirm */}
      <ConfirmModal
        open={pending?.kind === "toggle-active"}
        title={pending?.kind === "toggle-active" && pending.user.active ? "Desactivar usuario" : "Activar usuario"}
        message={
          pending?.kind === "toggle-active"
            ? pending.user.active
              ? `Vas a desactivar a ${pending.user.email}. No va a poder ingresar y se cerrarán sus sesiones activas.`
              : `Vas a reactivar a ${pending.user.email}. Va a poder ingresar nuevamente.`
            : undefined
        }
        confirmLabel={pending?.kind === "toggle-active" && pending.user.active ? "Desactivar" : "Activar"}
        onConfirm={runAction}
        onCancel={closeAction}
      />
    </div>
  )
}
