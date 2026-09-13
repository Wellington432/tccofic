import Image from 'next/image'
import AppShell from '@/components/AppShell'

export default function FavoritosPage() {
  return (
    <AppShell title="Favoritos">
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Image src="/produce/alface_folhas.png" alt="" width={337} height={264} className="w-24 h-auto opacity-70" />
        <p className="text-ink-400 text-sm max-w-xs">
          A funcionalidade de favoritos ainda não está disponível nesta versão.
        </p>
      </div>
    </AppShell>
  )
}
