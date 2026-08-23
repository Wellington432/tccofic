'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Check, Loader2, Leaf } from 'lucide-react'
import { Produto } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { useCart } from '@/contexts/CartContext'
import { getApiErrorMessage } from '@/lib/api'

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-card border border-card-border shadow-card p-3 flex flex-col gap-2">
      <div className="w-full aspect-square rounded-input bg-gray-100 animate-pulse" />
      <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
      <div className="h-3 w-1/3 rounded bg-gray-100 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
    </div>
  )
}

export default function ProductCard({ produto }: { produto: Produto }) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd() {
    setAdding(true)
    setError('')
    try {
      await addItem(produto.id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível adicionar ao carrinho.'))
      setTimeout(() => setError(''), 2500)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="relative bg-white rounded-card border border-card-border shadow-card p-3 flex flex-col">
      <div className="relative w-full aspect-square rounded-input overflow-hidden bg-bg-app">
        {produto.banner ? (
          <Image
            src={produto.banner}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 45vw, 200px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-horta-medium/40" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-sm text-gray-800 mt-3 line-clamp-1">{produto.nome}</h3>
      <span className="text-xs text-gray-400">{produto.unidade}</span>
      <span className="font-bold text-horta-dark mt-1">{formatPrice(produto.preco)}</span>

      <button
        type="button"
        onClick={handleAdd}
        disabled={adding}
        aria-label={`Adicionar ${produto.nome} ao carrinho`}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-horta-medium text-white flex items-center justify-center shadow-md hover:bg-horta-dark active:scale-95 transition-all disabled:opacity-70"
      >
        {adding ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : added ? (
          <Check className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </button>

      {error && (
        <div className="absolute inset-x-2 -bottom-2 translate-y-full text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1 text-center z-10">
          {error}
        </div>
      )}
    </div>
  )
}
