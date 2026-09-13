import { Instagram, Facebook, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="flex flex-col lg:flex-row bg-horta-dark rounded-card px-6 sm:px-8 py-8 lg:py-10 items-center justify-center lg:justify-between gap-4 text-center lg:text-left">
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
