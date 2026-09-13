'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import AppShell from '@/components/AppShell'
import CategoryGrid from '@/components/home/CategoryGrid'
import ProductCard, { ProductCardSkeleton } from '@/components/home/ProductCard'
import { api, getApiErrorMessage } from '@/lib/api'
import { Categoria, Produto } from '@/lib/types'

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriasLoading, setCategoriasLoading] = useState(true)
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | undefined>(undefined)

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtosLoading, setProdutosLoading] = useState(true)

  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<Categoria[]>('/listcategoria')
      .then(({ data }) => setCategorias(data))
      .catch((err) => setError(getApiErrorMessage(err, 'Não foi possível carregar as categorias.')))
      .finally(() => setCategoriasLoading(false))
  }, [])

  useEffect(() => {
    let active = true
    setProdutosLoading(true)
    api
      .get<Produto[]>('/listproduto', {
        params: categoriaAtiva ? { id_categoria: categoriaAtiva } : {},
      })
      .then(({ data }) => {
        if (active) setProdutos(data)
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err, 'Não foi possível carregar os produtos.'))
      })
      .finally(() => {
        if (active) setProdutosLoading(false)
      })
    return () => {
      active = false
    }
  }, [categoriaAtiva])

  return (
    <AppShell title="Categorias">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <CategoryGrid
        categorias={categorias}
        loading={categoriasLoading}
        activeId={categoriaAtiva}
        onSelect={setCategoriaAtiva}
      />

      <section>
        <h2 className="font-bold text-lg text-ink-800 mb-4">
          {categoriaAtiva
            ? categorias.find((c) => c.id === categoriaAtiva)?.nome ?? 'Produtos'
            : 'Todos os produtos'}
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,190px))] sm:grid-cols-[repeat(auto-fit,minmax(150px,220px))] gap-4">
          {produtosLoading && [...Array(5)].map((_, i) => <ProductCardSkeleton key={i} />)}

          {!produtosLoading && produtos.length === 0 && (
            <p className="col-span-full text-sm text-ink-400">Nenhum produto encontrado.</p>
          )}

          {!produtosLoading && produtos.map((produto) => <ProductCard key={produto.id} produto={produto} />)}
        </div>
      </section>
    </AppShell>
  )
}
