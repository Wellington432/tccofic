import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'

export default function Cadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await api.post('/novousuario', { nome, email, senha })
      setSucesso(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err: any) {
      if (err?.response) {
        setErro(err.response.data?.error || `Erro ${err.response.status}`)
      } else if (err?.request) {
        setErro('Sem resposta do servidor. Verifique se o backend está rodando na porta 3333.')
      } else {
        setErro(err?.message || 'Erro ao cadastrar.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-horta-800 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-6">🥦</div>
          <h1 className="text-4xl font-bold mb-4">Verde Campo</h1>
          <p className="text-horta-200 text-lg leading-relaxed">
            Crie sua conta e aproveite os melhores produtos frescos da região.
          </p>
          <div className="mt-10 flex justify-center gap-6 text-4xl">
            <span>🍇</span>
            <span>🥑</span>
            <span>🍓</span>
            <span>🥝</span>
            <span>🌽</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-horta-50">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <div className="mb-8 text-center">
              <span className="text-5xl">🌿</span>
              <h2 className="text-2xl font-bold text-gray-800 mt-3">Criar conta</h2>
              <p className="text-gray-500 text-sm mt-1">Preencha os dados para se cadastrar</p>
            </div>

            {erro && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="mb-4 p-3 bg-horta-50 border border-horta-200 rounded-xl text-horta-700 text-sm">
                Conta criada! Redirecionando para o login...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="João da Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading || sucesso} className="btn-primary w-full text-center mt-2">
                {loading ? 'Cadastrando...' : 'Criar conta'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Já tem conta?{' '}
              <Link to="/" className="text-horta-700 font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
