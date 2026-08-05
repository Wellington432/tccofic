import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <header className="bg-horta-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-2xl">🌿</span>
          <span>Verde Campo</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/home" className="text-horta-100 hover:text-white text-sm font-medium transition-colors">
            Produtos
          </Link>

          {user?.tipo === 'ADM' && (
            <>
              <Link to="/admin/produtos" className="text-horta-100 hover:text-white text-sm font-medium transition-colors">
                Gerenciar Produtos
              </Link>
              <Link to="/admin/categorias" className="text-horta-100 hover:text-white text-sm font-medium transition-colors">
                Categorias
              </Link>
            </>
          )}

          <div className="flex items-center gap-3 border-l border-horta-600 pl-6 ml-2">
            <span className="text-horta-200 text-sm hidden sm:block">
              Olá, <strong className="text-white">{user?.nome.split(' ')[0]}</strong>
            </span>
            <button
              onClick={handleSignOut}
              className="bg-horta-600 hover:bg-horta-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
