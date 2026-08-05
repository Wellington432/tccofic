import { useEffect, useState, FormEvent, useRef } from 'react'
import Header from '../../components/Header'
import api from '../../api/api'

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

interface FormFields {
  nome: string
  preco: string
  unidade: string
  descricao: string
  id_categoria: string
}

const emptyForm: FormFields = {
  nome: '',
  preco: '',
  unidade: '',
  descricao: '',
  id_categoria: '',
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<FormFields>(emptyForm)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        api.get<Produto[]>('/listproduto'),
        api.get<Categoria[]>('/listcategoria'),
      ])
      setProdutos(prods)
      setCategorias(cats)
    } catch {
      // silently ignore
    }
  }

  function abrirModal() {
    setForm(emptyForm)
    setArquivo(null)
    setPreviewUrl('')
    setErro('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setArquivo(null)
    setPreviewUrl('')
    setErro('')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setArquivo(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl('')
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')

    if (!arquivo) {
      setErro('Selecione uma imagem para o produto.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('nome', form.nome)
      formData.append('preco', String(parseFloat(form.preco)))
      formData.append('unidade', form.unidade)
      formData.append('descricao', form.descricao)
      formData.append('id_categoria', form.id_categoria)
      formData.append('banner', arquivo)

      await api.post('/novoproduto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      fecharModal()
      carregarDados()
    } catch (err: any) {
      setErro(err?.response?.data?.error || 'Erro ao salvar produto.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete('/deletaproduto', { data: { id } })
      setConfirmDelete(null)
      carregarDados()
    } catch {
      // silently ignore
    }
  }

  return (
    <div className="min-h-screen bg-horta-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h1>
            <p className="text-gray-500 text-sm mt-1">{produtos.length} produto(s) cadastrado(s)</p>
          </div>
          <button onClick={abrirModal} className="btn-primary">
            + Novo Produto
          </button>
        </div>

        {/* Tabela */}
        <div className="card overflow-hidden">
          {produtos.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-medium">Nenhum produto cadastrado ainda.</p>
              <button onClick={abrirModal} className="mt-4 text-horta-700 text-sm hover:underline">
                Adicionar primeiro produto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Produto</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Categoria</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Preço</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Unidade</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produtos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.banner}
                            alt={p.nome}
                            className="w-10 h-10 rounded-lg object-cover bg-horta-100"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                'https://placehold.co/40x40/d1fae5/166534?text=P'
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-800">{p.nome}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{p.descricao}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block text-xs font-semibold text-horta-700 bg-horta-100 px-2 py-0.5 rounded-full">
                          {p.categoria.nome}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {parseFloat(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{p.unidade}</td>
                      <td className="px-6 py-4 text-right">
                        {confirmDelete === p.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-gray-500">Confirmar exclusão?</span>
                            <button onClick={() => handleDelete(p.id)} className="btn-danger text-xs py-1 px-3">
                              Sim
                            </button>
                            <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs py-1 px-3">
                              Não
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(p.id)}
                            className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                          >
                            Excluir
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal novo produto */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Novo Produto</h2>
              <button onClick={fecharModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {erro && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{erro}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do produto</label>
                <input name="nome" className="input-field" placeholder="Ex: Banana Prata" value={form.nome} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preço (R$)</label>
                  <input name="preco" type="number" step="0.01" min="0" className="input-field" placeholder="0,00" value={form.preco} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Unidade</label>
                  <input name="unidade" className="input-field" placeholder="kg, un, cx..." value={form.unidade} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                <select name="id_categoria" className="input-field" value={form.id_categoria} onChange={handleChange} required>
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                <textarea
                  name="descricao"
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Descreva o produto..."
                  value={form.descricao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagem do produto</label>
                <input
                  ref={inputFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => inputFileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-sm text-gray-500 hover:border-horta-400 hover:text-horta-600 transition-colors"
                >
                  {arquivo ? arquivo.name : 'Clique para selecionar uma imagem'}
                </button>
              </div>

              {previewUrl && (
                <div className="h-40 rounded-xl overflow-hidden bg-horta-50 border border-gray-200">
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fecharModal} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Salvando...' : 'Salvar produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
