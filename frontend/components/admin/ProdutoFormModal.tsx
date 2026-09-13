'use client'

import { FormEvent, useState } from 'react'
import { X } from 'lucide-react'
import { api, getApiErrorMessage } from '@/lib/api'
import { Categoria, Produto } from '@/lib/types'
import PrimaryButton from '@/components/PrimaryButton'

interface ProdutoFormModalProps {
  categorias: Categoria[]
  produto: Produto | null
  onClose: () => void
  onSaved: () => void
}

export default function ProdutoFormModal({ categorias, produto, onClose, onSaved }: ProdutoFormModalProps) {
  const isEdit = !!produto

  const [nome, setNome] = useState(produto?.nome ?? '')
  const [preco, setPreco] = useState(produto?.preco ?? '')
  const [unidade, setUnidade] = useState(produto?.unidade ?? '')
  const [descricao, setDescricao] = useState(produto?.descricao ?? '')
  const [idCategoria, setIdCategoria] = useState(produto?.id_categoria ?? categorias[0]?.id ?? '')
  const [estoque, setEstoque] = useState(String(produto?.estoque ?? 0))
  const [banner, setBanner] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!isEdit && !banner) {
      setError('Selecione uma imagem para o produto.')
      return
    }

    const formData = new FormData()
    formData.append('nome', nome)
    formData.append('preco', preco)
    formData.append('unidade', unidade)
    formData.append('descricao', descricao)
    formData.append('id_categoria', idCategoria)
    formData.append('estoque', estoque)
    if (banner) formData.append('banner', banner)
    if (isEdit) formData.append('id', produto.id)

    setSaving(true)
    try {
      if (isEdit) {
        await api.put('/atualizaproduto', formData)
      } else {
        await api.post('/novoproduto', formData)
      }
      onSaved()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível salvar o produto.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-horta-dark">{isEdit ? 'Editar produto' : 'Novo produto'}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-ink-400 hover:text-ink-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full h-11 rounded-input border border-input-border px-3.5 text-sm outline-none focus:border-horta-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Preço (R$)</label>
              <input
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                type="number"
                step="0.01"
                min="0.01"
                required
                className="w-full h-11 rounded-input border border-input-border px-3.5 text-sm outline-none focus:border-horta-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Unidade</label>
              <input
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                placeholder="ex: 1kg, Unidade"
                required
                className="w-full h-11 rounded-input border border-input-border px-3.5 text-sm outline-none focus:border-horta-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={3}
              className="w-full rounded-input border border-input-border px-3.5 py-2.5 text-sm outline-none focus:border-horta-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Categoria</label>
              <select
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
                required
                className="w-full h-11 rounded-input border border-input-border px-3.5 text-sm outline-none focus:border-horta-medium bg-white"
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Estoque</label>
              <input
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                type="number"
                step="1"
                min="0"
                required
                className="w-full h-11 rounded-input border border-input-border px-3.5 text-sm outline-none focus:border-horta-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">
              Imagem {isEdit && <span className="text-ink-400">(deixe em branco para manter a atual)</span>}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setBanner(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-ink-600 file:mr-3 file:h-9 file:px-4 file:rounded-input file:border-0 file:bg-horta-medium/10 file:text-horta-dark file:text-sm file:font-medium"
            />
          </div>

          <PrimaryButton type="submit" loading={saving} className="mt-2">
            {saving ? 'Salvando...' : 'Salvar produto'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}
