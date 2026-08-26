import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import LeafWatermark from '@/components/LeafWatermark'

interface StaticPageHeroProps {
  icon: LucideIcon
  title: string
  children: ReactNode
}

export default function StaticPageHero({ icon: Icon, title, children }: StaticPageHeroProps) {
  return (
    <div className="relative max-w-2xl">
      <LeafWatermark />

      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-horta-medium/10 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-horta-medium" />
        </div>
        <h1 className="text-h1 font-bold text-horta-dark">{title}</h1>
      </div>

      <div className="bg-white rounded-card border border-card-border shadow-card p-6 space-y-4">
        {children}
      </div>
    </div>
  )
}
