import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../api/api'

export interface User {
  id: string
  nome: string
  email: string
  tipo: 'ADM' | 'CLIENTE'
  token: string
}

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, senha: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('@hortifruti:user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  async function signIn(email: string, senha: string) {
    const { data } = await api.post<User>('/sessao', { email, senha })
    setUser(data)
    localStorage.setItem('@hortifruti:user', JSON.stringify(data))
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('@hortifruti:user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
