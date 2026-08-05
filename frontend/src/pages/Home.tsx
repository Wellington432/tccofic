import { useEffect, useState } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import api from '../api/api'

interface Categoria {
  id: string
  nome: string
}

interface Produto {
  id: string
  nome: string
  preco: string
  unidade: string
  descricao: string
  banner: string
  categoria: Categoria
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('')
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get<Produto[]>('/listproduto')
        setProdutos(data)

        const cats = Array.from(
          new Map(data.map((p) => [p.categoria.id, p.categoria])).values()
        )
        setCategorias(cats)
      } catch {
        // silently ignore — backend may be offline
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  async function filtrarPorCategoria(id: string) {
    setCategoriaSelecionada(id)
    setLoading(true)
    try {
      const url = id ? `/listproduto?id_categoria=${id}` : '/listproduto'
      const { data } = await api.get<Produto[]>(url)
      setProdutos(data)
    } finally {
      setLoading(false)
    }
  }

  const produtosFiltrados = busca
    ? produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))
    : produtos

  return (
    <div className="min-h-screen bg-horta-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-horta-800 to-horta-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              🌿 Frescos do campo para você
            </h1>
            <p className="text-horta-200 text-lg mb-6">
              Frutas, verduras e legumes selecionados com cuidado.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-5 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-horta-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtro de categorias */}
        {categorias.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            <button
              onClick={() => filtrarPorCategoria('')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoriaSelecionada === ''
                  ? 'bg-horta-700 text-white'
                  : 'bg-white text-gray-600 hover:bg-horta-50 border border-gray-200'
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => filtrarPorCategoria(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoriaSelecionada === cat.id
                    ? 'bg-horta-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-horta-50 border border-gray-200'
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        )}

        {/* Grid de produtos */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-4 animate-bounce">🥬</div>
              <p>Carregando produtos...</p>
            </div>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-4">🫙</div>
              <p className="font-medium">Nenhum produto encontrado.</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{produtosFiltrados.length} produto(s) encontrado(s)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {produtosFiltrados.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
