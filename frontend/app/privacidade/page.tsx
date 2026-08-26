import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import StaticPageHero from '@/components/StaticPageHero'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-bg-app px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/cadastro" className="inline-flex items-center gap-2 text-horta-dark hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <StaticPageHero icon={ShieldCheck} title="Política de Privacidade">
          <p className="text-ink-600 leading-relaxed">
            Seus dados (nome, e-mail e senha criptografada) são usados exclusivamente
            para autenticação e processamento dos seus pedidos junto à Unidade Rural
            da ETEC Jales. Não compartilhamos suas informações com terceiros, exceto
            o processador de pagamentos utilizado no checkout.
          </p>
        </StaticPageHero>
      </div>
    </div>
  )
}
