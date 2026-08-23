import axios, { AxiosError } from 'axios'

const STORAGE_KEY = '@feiraetec:auth'

export interface StoredAuth {
  token: string
  id: string
  nome: string
  email: string
  tipo: 'ADM' | 'CLIENTE'
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

export function setStoredAuth(auth: StoredAuth) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearStoredAuth() {
  window.localStorage.removeItem(STORAGE_KEY)
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  const auth = getStoredAuth()
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export function getApiErrorMessage(err: unknown, fallback = 'Não foi possível completar a operação.'): string {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{ error?: string }>
    return axiosErr.response?.data?.error ?? fallback
  }
  return fallback
}
