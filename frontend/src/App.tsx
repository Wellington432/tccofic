import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import Produtos from './pages/admin/Produtos'
import Categorias from './pages/admin/Categorias'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas autenticadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>

          {/* Rotas de admin */}
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin/produtos" element={<Produtos />} />
            <Route path="/admin/categorias" element={<Categorias />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
