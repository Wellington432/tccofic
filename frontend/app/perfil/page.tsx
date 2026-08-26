'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, LogOut, Mail, ShieldCheck } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { useAuth } from '@/contexts/AuthContext'
import { api, getApiErrorMessage } from '@/lib/api'
import { Usuario } from '@/lib/types'

export default function PerfilPage() {
  const { signOut } = useAuth()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<Usuario>('/listusuario')
      .then(({ data }) => setUsuario(data))
      .catch((err) => setError(getApiErrorMessage(err, 'Não foi possível carregar seu perfil.')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppShell title="Meu perfil">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-card border border-card-border shadow-card p-6 space-y-3 max-w-md">
          <div className="h-5 w-40 bg-ink-100 rounded animate-pulse" />
          <div className="h-4 w-56 bg-ink-100 rounded animate-pulse" />
        </div>
      )}

      {!loading && usuario && (
        <div className="bg-white rounded-card border border-card-border shadow-card p-6 max-w-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-horta-dark text-white flex items-center justify-center font-bold text-xl">
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-ink-800">{usuario.nome}</h2>
              <span className="inline-flex items-center gap-1 text-xs text-horta-medium font-medium mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {usuario.tipo === 'ADM' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5 text-sm text-ink-600">
            <Mail className="w-4 h-4 text-ink-400" />
            {usuario.email}
          </div>

          <button
            type="button"
            onClick={signOut}
            className="w-full h-12 mt-6 rounded-input border border-brand-red/25 text-brand-red font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-red/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        </div>
      )}
    </AppShell>
  )
}
