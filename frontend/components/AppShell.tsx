'use client'

import { useState, ReactNode } from 'react'
import AuthGuard from '@/components/AuthGuard'
import DesktopHeader from '@/components/home/DesktopHeader'
import MobileHeader from '@/components/home/MobileHeader'
import Sidebar from '@/components/home/Sidebar'
import BottomTabBar from '@/components/home/BottomTabBar'
import Footer from '@/components/home/Footer'

interface AppShellProps {
  children: ReactNode
  title?: string
}

function AppShellContent({ children, title }: AppShellProps) {
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen bg-bg-app pb-20 lg:pb-0">
      <DesktopHeader search={search} onSearchChange={setSearch} />
      <MobileHeader search={search} onSearchChange={setSearch} />

      <div className="max-w-7xl mx-auto lg:flex px-4 sm:px-6 lg:px-8">
        <Sidebar />

        <main className="flex-1 min-w-0 py-6 lg:py-8 flex flex-col gap-6">
          {title && <h1 className="font-bold text-xl text-horta-dark">{title}</h1>}
          {children}
          <Footer />
        </main>
      </div>

      <BottomTabBar />
    </div>
  )
}

export default function AppShell(props: AppShellProps) {
  return (
    <AuthGuard>
      <AppShellContent {...props} />
    </AuthGuard>
  )
}
