'use client'

import Link from 'next/link'
import { Salad, Apple, Leaf, Egg, Package, LucideIcon } from 'lucide-react'
import { Categoria } from '@/lib/types'

function iconForCategoria(nome: string): LucideIcon {
  const n = nome.toLowerCase()
  if (n.includes('hortal') || n.includes('verdura') || n.includes('folha')) return Salad
  if (n.includes('fruta')) return Apple
  if (n.includes('tempero') || n.includes('erva')) return Leaf
  if (n.includes('ovo')) return Egg
  return Package
}

interface CategoryGridProps {
  categorias: Categoria[]
  loading: boolean
  activeId?: string
  onSelect: (id: string | undefined) => void
}

function CardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full aspect-square rounded-card bg-gray-100 animate-pulse" />
      <div className="h-3 w-14 rounded bg-gray-100 animate-pulse" />
    </div>
  )
}

export default function CategoryGrid({ categorias, loading, activeId, onSelect }: CategoryGridProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-gray-800">Categorias</h2>
        <Link href="/categorias" className="text-horta-dark text-sm font-medium hover:underline">
          Ver todas
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {loading &&
          [...Array(5)].map((_, i) => <CardSkeleton key={i} />)}

        {!loading && categorias.length === 0 && (
          <p className="col-span-full text-sm text-gray-400">Nenhuma categoria cadastrada ainda.</p>
        )}

        {!loading &&
          categorias.slice(0, 5).map((categoria) => {
            const Icon = iconForCategoria(categoria.nome)
            const active = activeId === categoria.id
            return (
              <button
                key={categoria.id}
                type="button"
                onClick={() => onSelect(active ? undefined : categoria.id)}
                className={`flex flex-col items-center gap-2 group`}
              >
                <div
                  className={`w-full aspect-square rounded-card bg-white border flex items-center justify-center shadow-card transition-colors ${
                    active ? 'border-horta-medium' : 'border-card-border'
                  }`}
                >
                  <Icon className={`w-7 h-7 ${active ? 'text-horta-dark' : 'text-horta-medium'}`} />
                </div>
                <span
                  className={`text-xs font-medium text-center leading-tight ${
                    active ? 'text-horta-dark' : 'text-gray-600'
                  }`}
                >
                  {categoria.nome}
                </span>
              </button>
            )
          })}
      </div>
    </section>
  )
}
