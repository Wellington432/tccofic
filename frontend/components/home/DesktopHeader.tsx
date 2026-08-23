'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, ShoppingCart, ChevronDown, LogOut, UserCircle, LayoutDashboard } from 'lucide-react'
import Logo from '@/components/Logo'
import SearchBar from '@/components/SearchBar'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

interface DesktopHeaderProps {
  search: string
  onSearchChange: (v: string) => void
}

export default function DesktopHeader({ search, onSearchChange }: DesktopHeaderProps) {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="hidden lg:flex sticky top-0 z-30 h-20 bg-white border-b border-card-border items-center px-8 gap-8">
      <Link href="/">
        <Logo variant="compact" />
      </Link>

      <div className="flex-1 max-w-xl">
        <SearchBar value={search} onChange={onSearchChange} />
      </div>

      <div className="flex items-center gap-5 ml-auto">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-app transition-colors"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5 text-gray-500" />
        </button>

        <Link
          href="/carrinho"
          className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-app transition-colors"
          aria-label="Carrinho"
        >
          <ShoppingCart className="w-5 h-5 text-gray-500" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-full bg-horta-dark text-white flex items-center justify-center font-semibold text-sm">
              {user?.nome?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <span className="text-sm font-medium text-gray-700">Olá, {user?.nome?.split(' ')[0] ?? 'Cliente'}!</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-card border border-card-border shadow-card py-2 overflow-hidden">
              <Link
                href="/perfil"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-bg-app transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <UserCircle className="w-4 h-4" />
                Meu perfil
              </Link>
              {user?.tipo === 'ADM' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-bg-app transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Painel admin
                </Link>
              )}
              <button
                type="button"
                onClick={signOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-red hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
