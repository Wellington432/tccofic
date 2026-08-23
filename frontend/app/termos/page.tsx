import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-bg-app px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/cadastro" className="inline-flex items-center gap-2 text-horta-dark hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold text-horta-dark mb-4">Termos de Uso</h1>
        <p className="text-gray-600 leading-relaxed">
          Ao usar o FeiraEtec você concorda em fornecer informações verdadeiras no
          cadastro, utilizar a plataforma apenas para compras legítimas de produtos
          da Unidade Rural da ETEC Jales e respeitar as políticas de pagamento e
          entrega descritas no momento da compra.
        </p>
      </div>
    </div>
  )
}
