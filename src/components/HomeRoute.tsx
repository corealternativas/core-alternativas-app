import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface HomeRouteProps {
  children: React.ReactNode
}

export const HomeRoute: React.FC<HomeRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === "admin") return <Navigate to="/admin/results" replace />

  return <>{children}</>
}
