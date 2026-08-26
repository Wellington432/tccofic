import { Heart } from 'lucide-react'
import AppShell from '@/components/AppShell'

export default function FavoritosPage() {
  return (
    <AppShell title="Favoritos">
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Heart className="w-10 h-10 text-ink-300" />
        <p className="text-ink-400 text-sm max-w-xs">
          A funcionalidade de favoritos ainda não está disponível nesta versão.
        </p>
      </div>
    </AppShell>
  )
}
