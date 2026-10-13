import React, { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FormInput } from "../components/FormInput/FormInput"
import { Button } from "../components/Button/Button"
import {
  StyledCard,
  StyledForm,
  StyledTitle,
  StyledSubtitle,
  StyledError,
  StyledWrapper,
} from "./Login.style"

interface LocationState {
  from?: string
}

export const Login: React.FC = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const explicitFrom = (location.state as LocationState | null)?.from

  if (user) {
    const target =
      explicitFrom || (user.role === "admin" ? "/admin/results" : "/calculadora")
    return <Navigate to={target} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const loggedUser = await login(email, password)
      const target =
        explicitFrom ||
        (loggedUser.role === "admin" ? "/admin/results" : "/calculadora")
      navigate(target, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error de conexión"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledWrapper>
      <StyledCard>
        <StyledTitle>Iniciar sesión</StyledTitle>
        <StyledSubtitle>
          Ingresá con las credenciales que te dio tu administrador.
        </StyledSubtitle>
        <StyledForm onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <StyledError>{error}</StyledError>}
          <Button type="submit" loading={loading}>
            Entrar
          </Button>
        </StyledForm>
      </StyledCard>
    </StyledWrapper>
  )
}
