import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  adminOnly?: boolean
}

export default function PrivateRoute({ adminOnly = false }: Props) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/" replace />
  if (adminOnly && user?.tipo !== 'ADM') return <Navigate to="/home" replace />

  return <Outlet />
}
