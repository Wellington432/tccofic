'use client'

import Link from 'next/link'
import { Bell, ShoppingCart } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

interface MobileHeaderProps {
  search: string
  onSearchChange: (v: string) => void
}

export default function MobileHeader({ search, onSearchChange }: MobileHeaderProps) {
  const { user } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="lg:hidden bg-horta-dark rounded-b-card-lg px-5 pt-6 pb-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white font-bold text-lg">Olá, {user?.nome?.split(' ')[0] ?? 'Cliente'}!</h1>
          <p className="text-white/75 text-xs mt-1 max-w-[220px] leading-snug">
            Produtos fresquinhos direto da nossa unidade rural 🌿
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4 text-white" />
          </button>
          <Link
            href="/carrinho"
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
            aria-label="Carrinho"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-brand-red text-white text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <SearchBar value={search} onChange={onSearchChange} className="mt-4" />
    </header>
  )
}
