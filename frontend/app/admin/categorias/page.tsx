'use client'

import { FormEvent, useEffect, useState } from 'react'
import { AlertTriangle, Plus, FolderTree } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import { api, getApiErrorMessage } from '@/lib/api'
import { Categoria } from '@/lib/types'
import PrimaryButton from '@/components/PrimaryButton'

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)

  async function carregar() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get<Categoria[]>('/listcategoria')
      setCategorias(data)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar as categorias.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.post('/novacategoria', { nome })
      setNome('')
      await carregar()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível criar a categoria.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell title="Categorias">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-card border border-card-border shadow-card p-5 flex items-end gap-3 max-w-lg">
        <div className="flex-1">
          <label className="block text-xs font-medium text-ink-500 mb-1">Nova categoria</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="ex: Hortaliças"
            className="w-full h-11 rounded-input border border-input-border px-3.5 text-sm outline-none focus:border-horta-medium"
          />
        </div>
        <PrimaryButton type="submit" loading={saving} className="w-auto px-5 h-11">
          <Plus className="w-4 h-4" />
          Adicionar
        </PrimaryButton>
      </form>

      {loading && (
        <div className="space-y-2 max-w-lg">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-white rounded-card border border-card-border animate-pulse" />
          ))}
        </div>
      )}

      {!loading && categorias.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FolderTree className="w-10 h-10 text-ink-300" />
          <p className="text-ink-400 text-sm">Nenhuma categoria cadastrada ainda.</p>
        </div>
      )}

      {!loading && categorias.length > 0 && (
        <div className="bg-white rounded-card border border-card-border shadow-card divide-y divide-card-border max-w-lg">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="px-4 py-3 flex items-center gap-3">
              <FolderTree className="w-4 h-4 text-horta-medium shrink-0" />
              <span className="text-sm text-ink-700">{categoria.nome}</span>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
