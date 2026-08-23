'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AlertTriangle, Plus, Pencil, Trash2, Package } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import ProdutoFormModal from '@/components/admin/ProdutoFormModal'
import { api, getApiErrorMessage } from '@/lib/api'
import { Categoria, Produto } from '@/lib/types'
import { formatPrice } from '@/lib/format'

const ESTOQUE_BAIXO_LIMIAR = 10

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Produto | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function carregar() {
    setLoading(true)
    setError('')
    try {
      const [produtosRes, categoriasRes] = await Promise.all([
        api.get<Produto[]>('/listproduto'),
        api.get<Categoria[]>('/listcategoria'),
      ])
      setProdutos(produtosRes.data)
      setCategorias(categoriasRes.data)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar os produtos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function abrirNovo() {
    setEditing(null)
    setModalOpen(true)
  }

  function abrirEdicao(produto: Produto) {
    setEditing(produto)
    setModalOpen(true)
  }

  function fecharModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function onSaved() {
    fecharModal()
    carregar()
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este produto? Essa ação não pode ser desfeita.')) return
    setDeletingId(id)
    setError('')
    try {
      await api.delete('/deletaproduto', { data: { id } })
      await carregar()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível excluir o produto.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminShell title="Produtos">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-input bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={abrirNovo}
          disabled={categorias.length === 0}
          className="h-11 px-5 rounded-input bg-horta-dark text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#0f4023] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </button>
      </div>

      {!loading && categorias.length === 0 && (
        <p className="text-sm text-brand-red">
          Cadastre ao menos uma categoria antes de criar produtos.
        </p>
      )}

      {loading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-card border border-card-border animate-pulse" />
          ))}
        </div>
      )}

      {!loading && produtos.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Package className="w-10 h-10 text-gray-300" />
          <p className="text-gray-400 text-sm">Nenhum produto cadastrado ainda.</p>
        </div>
      )}

      {!loading && produtos.length > 0 && (
        <div className="bg-white rounded-card border border-card-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-card-border">
                  <th className="font-medium px-4 py-3">Produto</th>
                  <th className="font-medium px-4 py-3">Categoria</th>
                  <th className="font-medium px-4 py-3 text-right">Preço</th>
                  <th className="font-medium px-4 py-3 text-right">Estoque</th>
                  <th className="font-medium px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id} className="border-b border-card-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-input overflow-hidden bg-bg-app shrink-0">
                          {produto.banner && (
                            <Image src={produto.banner} alt={produto.nome} fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{produto.nome}</p>
                          <p className="text-xs text-gray-400">{produto.unidade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{produto.categoria?.nome ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-horta-dark">
                      {formatPrice(produto.preco)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-medium tabular-nums ${
                          produto.estoque <= ESTOQUE_BAIXO_LIMIAR ? 'text-[#d03b3b]' : 'text-gray-700'
                        }`}
                      >
                        {produto.estoque}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => abrirEdicao(produto)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-bg-app transition-colors"
                          aria-label={`Editar ${produto.nome}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(produto.id)}
                          disabled={deletingId === produto.id}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-brand-red hover:bg-red-50 transition-colors disabled:opacity-50"
                          aria-label={`Excluir ${produto.nome}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <ProdutoFormModal categorias={categorias} produto={editing} onClose={fecharModal} onSaved={onSaved} />
      )}
    </AdminShell>
  )
}
