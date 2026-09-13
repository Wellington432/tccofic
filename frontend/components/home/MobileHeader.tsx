'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'
import { Bell, ShoppingCart } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

interface MobileHeaderProps {
  search: string
  onSearchChange: (v: string) => void
  onFilterClick?: () => void
  filterActive?: boolean
  hasActiveFilters?: boolean
  filterPanel?: ReactNode
}

export default function MobileHeader({
  search,
  onSearchChange,
  onFilterClick,
  filterActive,
  hasActiveFilters,
  filterPanel,
}: MobileHeaderProps) {
  const { user } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="lg:hidden bg-horta-dark rounded-b-card-lg px-5 pt-6 pb-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 p-1.5">
            <Image src="/logo-icon.png" alt="FeiraEtec" width={28} height={21} className="w-full h-auto" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Olá, {user?.nome?.split(' ')[0] ?? 'Cliente'}!</h1>
            <p className="text-white/75 text-xs mt-1 max-w-[220px] leading-snug">
              Produtos fresquinhos direto da nossa unidade rural 🌿
            </p>
          </div>
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

      <div className="relative">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          onFilterClick={onFilterClick}
          filterActive={filterActive}
          hasActiveFilters={hasActiveFilters}
          className="mt-4"
        />
        {filterActive && filterPanel && (
          <div className="absolute inset-x-0 top-full mt-2 z-40">{filterPanel}</div>
        )}
      </div>
    </header>
  )
}
