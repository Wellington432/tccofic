import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await signIn(email, senha)
      navigate('/home')
    } catch (err: any) {
      setErro(err?.response?.data?.error || 'Erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-horta-800 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-sm text-center">
          <div className="text-7xl mb-6">🌿</div>
          <h1 className="text-4xl font-bold mb-4">Verde Campo</h1>
          <p className="text-horta-200 text-lg leading-relaxed">
            Frutas e verduras frescas direto do campo para a sua mesa.
          </p>
          <div className="mt-10 flex justify-center gap-6 text-4xl">
            <span>🍎</span>
            <span>🥦</span>
            <span>🥕</span>
            <span>🍋</span>
            <span>🫑</span>
          </div>
        </div>
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex items-center justify-center p-6 bg-horta-50">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <div className="mb-8 text-center">
              <span className="text-5xl">🌿</span>
              <h2 className="text-2xl font-bold text-gray-800 mt-3">Bem-vindo de volta</h2>
              <p className="text-gray-500 text-sm mt-1">Entre na sua conta para continuar</p>
            </div>

            {erro && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-center mt-2"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="text-horta-700 font-semibold hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
