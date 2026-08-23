import { Instagram, Facebook, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="hidden lg:flex bg-horta-dark rounded-card mt-8 px-8 py-6 items-center justify-between">
      <div>
        <p className="text-white font-semibold text-sm">
          Feira Etec - Produtos da Unidade Rural - ETEC Jales
        </p>
        <p className="text-white/60 text-xs mt-1">© 2024 Todos os direitos reservados.</p>
      </div>

      <div className="flex items-center gap-3">
        {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Rede social"
          >
            <Icon className="w-4 h-4 text-white" />
          </a>
        ))}
      </div>
    </footer>
  )
}
