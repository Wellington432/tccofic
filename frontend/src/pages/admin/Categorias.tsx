import { useEffect, useState, FormEvent } from 'react'
import Header from '../../components/Header'
import api from '../../api/api'

interface Categoria {
  id: string
  nome: string
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarCategorias()
  }, [])

  async function carregarCategorias() {
    try {
      const { data } = await api.get<Categoria[]>('/listcategoria')
      setCategorias(data)
    } catch {
      // endpoint pode não existir ainda
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setLoading(true)
    try {
      await api.post('/novacategoria', { nome })
      setSucesso(`Categoria "${nome}" criada com sucesso!`)
      setNome('')
      carregarCategorias()
    } catch (err: any) {
      setErro(err?.response?.data?.error || 'Erro ao criar categoria.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-horta-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie as categorias de produtos.</p>
        </div>

        {/* Formulário */}
        <div className="card p-6 mb-8">
          <h2 className="font-semibold text-gray-700 mb-4">Nova categoria</h2>

          {erro && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{erro}</div>
          )}
          {sucesso && (
            <div className="mb-4 p-3 bg-horta-50 border border-horta-200 rounded-xl text-horta-700 text-sm">{sucesso}</div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Ex: Frutas, Verduras, Legumes..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? 'Salvando...' : '+ Adicionar'}
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Categorias cadastradas</h2>
          </div>
          {categorias.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <div className="text-4xl mb-3">📂</div>
              <p>Nenhuma categoria cadastrada.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categorias.map((cat) => (
                <li key={cat.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-horta-100 rounded-full flex items-center justify-center text-horta-700 font-bold text-sm">
                      {cat.nome.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium text-gray-800">{cat.nome}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{cat.id.slice(0, 8)}…</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
