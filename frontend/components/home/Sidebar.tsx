'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Package, Heart, Info, Phone, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'

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
  const { collapsed, toggleCollapsed } = useSidebar()

  const navItems = user?.tipo === 'ADM'
    ? [...NAV_ITEMS, { href: '/admin', label: 'Painel admin', icon: LayoutDashboard }]
    : NAV_ITEMS

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 gap-6 py-8 pr-6 transition-[width] duration-300 ${
        collapsed ? 'w-24' : 'w-64'
      }`}
    >
      <nav className="relative bg-white rounded-card border border-card-border p-3 flex flex-col gap-1">
        <button
          type="button"
          onClick={toggleCollapsed}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="absolute -right-3 top-3 w-6 h-6 rounded-full bg-white border border-card-border shadow-card flex items-center justify-center text-ink-400 hover:text-horta-dark transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-input text-sm font-medium transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              } ${active ? 'bg-horta-medium/10 text-horta-dark' : 'text-ink-500 hover:bg-bg-app'}`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && label}
            </Link>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="relative bg-horta-medium/10 rounded-card p-5 pr-16 overflow-hidden animate-rise-in">
          <p className="text-sm text-horta-dark font-medium leading-snug relative z-10">
            Produtos frescos direto da nossa unidade rural 🌿
          </p>
          <Image
            src="/produce/folhas_tomate.png"
            alt=""
            width={335}
            height={264}
            className="absolute -right-4 -bottom-4 w-24 h-auto opacity-90"
          />
        </div>
      )}
    </aside>
  )
}
