'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Package, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const TAB_ITEMS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/categorias', label: 'Categorias', icon: LayoutGrid },
  { href: '/pedidos', label: 'Pedidos', icon: Package },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export default function BottomTabBar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const tabItems = user?.tipo === 'ADM'
    ? [...TAB_ITEMS, { href: '/admin', label: 'Admin', icon: LayoutDashboard }]
    : TAB_ITEMS

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-card-border flex items-center justify-around h-[64px] pb-[env(safe-area-inset-bottom)]">
      {tabItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
          >
            <Icon className={`w-5 h-5 ${active ? 'text-horta-dark' : 'text-ink-400'}`} />
            <span className={`text-[11px] font-medium ${active ? 'text-horta-dark' : 'text-ink-400'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
