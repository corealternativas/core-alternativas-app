import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Route "/" behavior:
//   - not logged in       → /style-test (public)
//   - logged in as user   → /calculadora
//   - logged in as admin  → /admin/results
export const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/style-test" replace />
  if (user.role === "admin") return <Navigate to="/admin/results" replace />
  return <Navigate to="/calculadora" replace />
}
