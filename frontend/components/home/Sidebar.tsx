'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Package, Heart, Info, Phone, Leaf, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV_ITEMS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/categorias', label: 'Categorias', icon: LayoutGrid },
  { href: '/pedidos', label: 'Pedidos', icon: Package },
  { href: '/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/sobre', label: 'Sobre nós', icon: Info },
  { href: '/contato', label: 'Contato', icon: Phone },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = user?.tipo === 'ADM'
    ? [...NAV_ITEMS, { href: '/admin', label: 'Painel admin', icon: LayoutDashboard }]
    : NAV_ITEMS

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6 py-8 pr-6">
      <nav className="bg-white rounded-card border border-card-border p-3 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-input text-sm font-medium transition-colors ${
                active
                  ? 'bg-horta-medium/10 text-horta-dark'
                  : 'text-ink-500 hover:bg-bg-app'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="bg-horta-medium/10 rounded-card p-5 flex flex-col items-start gap-2">
        <Leaf className="w-6 h-6 text-horta-medium" />
        <p className="text-sm text-horta-dark font-medium leading-snug">
          Produtos frescos direto da nossa unidade rural 🌿
        </p>
      </div>
    </aside>
  )
}
