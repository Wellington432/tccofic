'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import DesktopHeader from '@/components/home/DesktopHeader'
import MobileHeader from '@/components/home/MobileHeader'
import Sidebar from '@/components/home/Sidebar'
import BottomTabBar from '@/components/home/BottomTabBar'
import Banner from '@/components/home/Banner'
import CategoryGrid from '@/components/home/CategoryGrid'
import ProductCard, { ProductCardSkeleton } from '@/components/home/ProductCard'
import BenefitsBar from '@/components/home/BenefitsBar'
import Footer from '@/components/home/Footer'
import { api, getApiErrorMessage } from '@/lib/api'
import { Categoria, Produto } from '@/lib/types'
import { useDebounce } from '@/hooks/useDebounce'

function HomeContent() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriasLoading, setCategoriasLoading] = useState(true)
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | undefined>(undefined)

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtosLoading, setProdutosLoading] = useState(true)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setCategoriasLoading(true)
    api
      .get<Categoria[]>('/listcategoria')
      .then(({ data }) => {
        if (active) setCategorias(data)
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err, 'Não foi possível carregar as categorias.'))
      })
      .finally(() => {
        if (active) setCategoriasLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    setProdutosLoading(true)
    api
      .get<Produto[]>('/listproduto', {
        params: {
          ...(categoriaAtiva ? { id_categoria: categoriaAtiva } : {}),
          ...(debouncedSearch ? { nome: debouncedSearch } : {}),
        },
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
  }, [categoriaAtiva, debouncedSearch])

  const sectionTitle = debouncedSearch ? 'Resultados da busca' : 'Destaques'
  const produtosExibidos = debouncedSearch ? produtos : produtos.slice(0, 5)

  return (
    <div className="min-h-screen bg-bg-app pb-20 lg:pb-0">
      <DesktopHeader search={search} onSearchChange={setSearch} />
      <MobileHeader search={search} onSearchChange={setSearch} />

      <div className="max-w-7xl mx-auto lg:flex px-4 sm:px-6 lg:px-8">
        <Sidebar />

        <main className="flex-1 min-w-0 py-6 lg:py-8 flex flex-col gap-8">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-input bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Banner />

          <CategoryGrid
            categorias={categorias}
            loading={categoriasLoading}
            activeId={categoriaAtiva}
            onSelect={setCategoriaAtiva}
          />

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800">{sectionTitle}</h2>
              {!debouncedSearch && (
                <a href="/categorias" className="text-horta-dark text-sm font-medium hover:underline">
                  Ver todas
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {produtosLoading &&
                [...Array(5)].map((_, i) => <ProductCardSkeleton key={i} />)}

              {!produtosLoading && produtosExibidos.length === 0 && (
                <p className="col-span-full text-sm text-gray-400">
                  Nenhum produto encontrado{debouncedSearch ? ` para "${debouncedSearch}"` : ''}.
                </p>
              )}

              {!produtosLoading &&
                produtosExibidos.map((produto) => <ProductCard key={produto.id} produto={produto} />)}
            </div>
          </section>

          <BenefitsBar />

          <Footer />
        </main>
      </div>

      <BottomTabBar />
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  )
}
