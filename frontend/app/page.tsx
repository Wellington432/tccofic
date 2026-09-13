'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, SearchX } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import DesktopHeader from '@/components/home/DesktopHeader'
import MobileHeader from '@/components/home/MobileHeader'
import Sidebar from '@/components/home/Sidebar'
import BottomTabBar from '@/components/home/BottomTabBar'
import Banner from '@/components/home/Banner'
import CategoryGrid from '@/components/home/CategoryGrid'
import ProductCard, { ProductCardSkeleton } from '@/components/home/ProductCard'
import FilterPanel, { ProductFilters } from '@/components/home/FilterPanel'
import BenefitsBar from '@/components/home/BenefitsBar'
import Footer from '@/components/home/Footer'
import { api, getApiErrorMessage } from '@/lib/api'
import { Categoria, Produto } from '@/lib/types'
import { useDebounce } from '@/hooks/useDebounce'

const EMPTY_FILTERS: ProductFilters = { precoMin: '', precoMax: '', apenasEstoque: false }

function HomeContent() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriasLoading, setCategoriasLoading] = useState(true)
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | undefined>(undefined)

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtosLoading, setProdutosLoading] = useState(true)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS)

  const [error, setError] = useState('')

  const filtersOpenRef = useRef(filtersOpen)
  filtersOpenRef.current = filtersOpen

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!filtersOpenRef.current) return
      const target = e.target as Element
      if (target.closest('[data-filter-panel]') || target.closest('[data-filter-toggle]')) return
      setFiltersOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

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

  const precoMin = filters.precoMin ? Number(filters.precoMin) : undefined
  const precoMax = filters.precoMax ? Number(filters.precoMax) : undefined

  const produtosFiltrados = produtos.filter((produto) => {
    const preco = Number(produto.preco)
    if (precoMin !== undefined && preco < precoMin) return false
    if (precoMax !== undefined && preco > precoMax) return false
    if (filters.apenasEstoque && produto.estoque <= 0) return false
    return true
  })

  const hasPriceOrStockFilter = precoMin !== undefined || precoMax !== undefined || filters.apenasEstoque
  const hasActiveFilters = hasPriceOrStockFilter || !!categoriaAtiva
  const isSearching = !!debouncedSearch

  const sectionTitle = isSearching ? 'Resultados da busca' : 'Destaques'
  const produtosExibidos = isSearching || hasPriceOrStockFilter ? produtosFiltrados : produtosFiltrados.slice(0, 5)

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS)
    setCategoriaAtiva(undefined)
  }

  const filterPanel = (
    <FilterPanel
      categorias={categorias}
      categoriaId={categoriaAtiva}
      onCategoriaChange={setCategoriaAtiva}
      filters={filters}
      onChange={setFilters}
      onClear={handleClearFilters}
      onClose={() => setFiltersOpen(false)}
    />
  )

  return (
    <div className="min-h-screen bg-bg-app pb-20 lg:pb-0">
      <DesktopHeader
        search={search}
        onSearchChange={setSearch}
        onFilterClick={() => setFiltersOpen((v) => !v)}
        filterActive={filtersOpen}
        hasActiveFilters={hasActiveFilters}
        filterPanel={filterPanel}
      />
      <MobileHeader
        search={search}
        onSearchChange={setSearch}
        onFilterClick={() => setFiltersOpen((v) => !v)}
        filterActive={filtersOpen}
        hasActiveFilters={hasActiveFilters}
        filterPanel={filterPanel}
      />

      <div className="max-w-[1600px] mx-auto lg:flex px-4 sm:px-6 lg:px-10">
        <Sidebar />

        <main className="flex-1 min-w-0 py-6 lg:py-10 flex flex-col">
          {error && (
            <div className="mb-6 flex items-center gap-2 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Banner />

          <div className="mt-10 lg:mt-14">
            <CategoryGrid
              categorias={categorias}
              loading={categoriasLoading}
              activeId={categoriaAtiva}
              onSelect={setCategoriaAtiva}
            />
          </div>

          <section className="mt-10 lg:mt-14">
            <div className="flex items-center justify-between mb-5 lg:mb-6">
              <h2 className="font-bold text-lg text-ink-800">{sectionTitle}</h2>
              {!isSearching && (
                <a href="/categorias" className="text-horta-dark text-sm font-medium hover:underline">
                  Ver todas
                </a>
              )}
            </div>

            {!produtosLoading && produtosExibidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <SearchX className="w-9 h-9 text-ink-300" />
                <p className="font-medium text-ink-600 text-sm">Nenhum produto encontrado</p>
                <p className="text-ink-400 text-sm max-w-xs">
                  {isSearching
                    ? `Não encontramos produtos correspondentes à sua busca por "${debouncedSearch}".`
                    : hasActiveFilters
                      ? 'Nenhum produto corresponde aos filtros selecionados.'
                      : 'Ainda não há produtos cadastrados nesta categoria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,190px))] sm:grid-cols-[repeat(auto-fit,minmax(150px,220px))] gap-4">
                {produtosLoading &&
                  [...Array(5)].map((_, i) => <ProductCardSkeleton key={i} />)}

                {!produtosLoading &&
                  produtosExibidos.map((produto) => <ProductCard key={produto.id} produto={produto} />)}
              </div>
            )}
          </section>

          <div className="mt-12 lg:mt-16">
            <BenefitsBar />
          </div>

          <div className="mt-16 lg:mt-20">
            <Footer />
          </div>
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
