import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import Logo from '@/components/Logo'

export default function EsqueciSenhaPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-app px-6">
      <div className="w-full max-w-[420px] text-center">
        <Logo variant="full" className="mb-8" />
        <Mail className="w-10 h-10 text-horta-medium mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-horta-dark">Recuperação de senha</h1>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          Essa funcionalidade ainda não está disponível. Entre em contato com a
          administração da unidade rural para redefinir sua senha.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-horta-dark font-semibold mt-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
