'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, ArrowLeft, LogOut } from 'lucide-react'
import AdminGuard from '@/components/AdminGuard'
import Logo from '@/components/Logo'
import { useAuth } from '@/contexts/AuthContext'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: FolderTree },
]

function AdminShellContent({ children, title }: { children: ReactNode; title: string }) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-bg-app lg:flex">
      <aside className="lg:w-64 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-card-border lg:min-h-screen p-5 flex lg:flex-col gap-6">
        <Link href="/">
          <Logo variant="compact" />
        </Link>

        <nav className="flex lg:flex-col gap-1 flex-1 overflow-x-auto lg:overflow-visible">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-input text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? 'bg-horta-medium/10 text-horta-dark' : 'text-gray-500 hover:bg-bg-app'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex flex-col gap-1 pt-4 border-t border-card-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-input text-sm font-medium text-gray-500 hover:bg-bg-app transition-colors"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
            Voltar à loja
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 rounded-input text-sm font-medium text-brand-red hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-5 sm:p-8 flex flex-col gap-6">
        <h1 className="font-bold text-xl text-horta-dark">{title}</h1>
        {children}
      </main>
    </div>
  )
}

export default function AdminShell(props: { children: ReactNode; title: string }) {
  return (
    <AdminGuard>
      <AdminShellContent {...props} />
    </AdminGuard>
  )
}
