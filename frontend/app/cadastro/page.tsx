'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getApiErrorMessage } from '@/lib/api'
import Logo from '@/components/Logo'
import FormInput from '@/components/FormInput'
import PrimaryButton from '@/components/PrimaryButton'
import OrDivider from '@/components/OrDivider'
import GoogleButton from '@/components/GoogleButton'
import LeafWatermark from '@/components/LeafWatermark'

export default function CadastroPage() {
  const { signUp } = useAuth()
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (!aceitouTermos) {
      setErro('Você precisa aceitar os Termos de Uso e a Política de Privacidade.')
      return
    }

    setLoading(true)
    try {
      await signUp(nome, email, senha)
      router.push('/')
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Não foi possível criar sua conta.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-app relative">
      <LeafWatermark />

      <div className="px-6 pt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-horta-dark hover:opacity-70 transition-opacity"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Voltar</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-[420px]">
          <Logo variant="full" className="mb-8" />

          <h1 className="text-[28px] font-bold text-horta-dark text-center">Criar conta</h1>
          <p className="text-gray-500 text-sm text-center mt-2">
            Preencha seus dados para se cadastrar.
          </p>

          {erro && (
            <div className="mt-5 p-3 rounded-input bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FormInput
              icon={User}
              type="text"
              placeholder="Nome completo"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <FormInput
              icon={Mail}
              type="email"
              placeholder="E-mail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              icon={Lock}
              type={showSenha ? 'text' : 'password'}
              placeholder="Senha"
              autoComplete="new-password"
              minLength={8}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowSenha((v) => !v)}
                  className="text-gray-400 hover:text-horta-medium transition-colors"
                  aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            <FormInput
              icon={Lock}
              type={showConfirmarSenha ? 'text' : 'password'}
              placeholder="Confirmar senha"
              autoComplete="new-password"
              minLength={8}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha((v) => !v)}
                  className="text-gray-400 hover:text-horta-medium transition-colors"
                  aria-label={showConfirmarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                className="mt-0.5 w-5 h-5 shrink-0 rounded border-2 border-horta-medium text-horta-dark focus:ring-horta-medium/30 accent-[#14532D]"
              />
              <span className="text-sm text-gray-600 leading-snug">
                Aceito os{' '}
                <Link href="/termos" className="text-horta-dark font-medium hover:underline">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link href="/privacidade" className="text-horta-dark font-medium hover:underline">
                  Política de Privacidade
                </Link>
              </span>
            </label>

            <PrimaryButton type="submit" loading={loading}>
              Cadastrar
            </PrimaryButton>
          </form>

          <OrDivider />

          <GoogleButton
            label="Cadastrar com Google"
            onClick={() => setErro('Cadastro com Google ainda não está disponível.')}
          />

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-horta-dark font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
