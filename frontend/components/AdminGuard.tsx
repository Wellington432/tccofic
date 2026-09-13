'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/Logo'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }
    if (user?.tipo !== 'ADM') {
      router.replace('/')
    }
  }, [isHydrated, isAuthenticated, user, router])

  if (!isHydrated || !isAuthenticated || user?.tipo !== 'ADM') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-app">
        <Logo variant="compact" className="animate-pulse" />
      </div>
    )
  }

  return <>{children}</>
}
