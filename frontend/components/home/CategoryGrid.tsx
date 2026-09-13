'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Categoria } from '@/lib/types'

function imageForCategoria(nome: string): string {
  const n = nome.toLowerCase()
  if (n.includes('hortal') || n.includes('verdura') || n.includes('folha')) return '/produce/icon-folha.png'
  if (n.includes('fruta')) return '/produce/icon-fruta.png'
  if (n.includes('tempero') || n.includes('erva') || n.includes('grão') || n.includes('grao')) return '/produce/icon-graos.png'
  if (n.includes('ovo')) return '/produce/icon-ovos.png'
  return '/produce/icon-caixa.png'
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
      <div className="w-full aspect-square rounded-card bg-ink-100 animate-pulse" />
      <div className="h-3 w-14 rounded bg-ink-100 animate-pulse" />
    </div>
  )
}

export default function CategoryGrid({ categorias, loading, activeId, onSelect }: CategoryGridProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5 lg:mb-6">
        <h2 className="font-bold text-lg text-ink-800">Categorias</h2>
        <Link href="/categorias" className="text-horta-dark text-sm font-medium hover:underline">
          Ver todas
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(96px,140px))] sm:grid-cols-[repeat(auto-fit,minmax(120px,170px))] gap-3 sm:gap-4">
        {loading &&
          [...Array(5)].map((_, i) => <CardSkeleton key={i} />)}

        {!loading && categorias.length === 0 && (
          <p className="col-span-full text-sm text-ink-400">Nenhuma categoria cadastrada ainda.</p>
        )}

        {!loading &&
          categorias.slice(0, 5).map((categoria) => {
            const iconSrc = imageForCategoria(categoria.nome)
            const active = activeId === categoria.id
            return (
              <button
                key={categoria.id}
                type="button"
                onClick={() => onSelect(active ? undefined : categoria.id)}
                className="flex flex-col items-center gap-2 group animate-rise-in"
                style={{ animationDelay: `${categorias.indexOf(categoria) * 50}ms` }}
              >
                <div
                  className={`w-full aspect-square rounded-card bg-white border flex items-center justify-center shadow-card transition-colors p-3 ${
                    active ? 'border-horta-medium' : 'border-card-border'
                  }`}
                >
                  <Image src={iconSrc} alt="" width={40} height={40} className="w-full h-full object-contain" />
                </div>
                <span
                  className={`text-xs font-medium text-center leading-tight ${
                    active ? 'text-horta-dark' : 'text-ink-600'
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
