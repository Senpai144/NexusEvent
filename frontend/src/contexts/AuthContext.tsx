import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('nexus_token')
  })
  const [loading, setLoading] = useState(false)

  const storeSession = (token: string, user: User) => {
    localStorage.setItem('nexus_token', token)
    localStorage.setItem('nexus_user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password)
    storeSession(data.access_token, data.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await authApi.register(name, email, password)
    storeSession(data.access_token, data.user)
  }

  const logout = () => {
    localStorage.removeItem('nexus_token')
    localStorage.removeItem('nexus_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
