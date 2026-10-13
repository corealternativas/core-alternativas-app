import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { apiFetch, clearToken, getToken, setToken } from "../services/services"

export interface AuthUser {
  id: string
  email: string
  name: string | null
  role: "user" | "admin"
  active: boolean
  last_login_at: string | null
  created_at: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function tryDevAutoLogin(
  setUser: (u: AuthUser | null) => void
): Promise<boolean> {
  if (!import.meta.env.DEV) return false
  const email = import.meta.env.VITE_DEV_LOGIN_EMAIL as string | undefined
  const password = import.meta.env.VITE_DEV_LOGIN_PASSWORD as string | undefined
  if (!email || !password) return false
  try {
    const data = await apiFetch<{ token: string; user: AuthUser }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    )
    setToken(data.token)
    setUser(data.user)
    console.info(`[dev] auto-login as ${data.user.email}`)
    return true
  } catch (err) {
    console.warn("[dev] auto-login failed", err)
    return false
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const refresh = useCallback(async () => {
    const token = getToken()
    try {
      if (!token) {
        if (await tryDevAutoLogin(setUser)) return
        setUser(null)
        return
      }
      try {
        const data = await apiFetch<{ user: AuthUser }>("/api/auth/me")
        setUser(data.user)
      } catch {
        clearToken()
        if (await tryDevAutoLogin(setUser)) return
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: AuthUser }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    )
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore
    }
    clearToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout, refresh }),
    [user, loading, login, logout, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
