'use client'

import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getApiErrorMessage } from '@/lib/api'
import Logo from '@/components/Logo'
import FormInput from '@/components/FormInput'
import PrimaryButton from '@/components/PrimaryButton'
import OrDivider from '@/components/OrDivider'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import DecorativeStrip from '@/components/DecorativeStrip'

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('sessao_expirada') === '1') {
      setErro('Sua sessão expirou. Faça login novamente.')
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await signIn(email, senha)
      router.push('/')
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Não foi possível entrar. Verifique seus dados.'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSuccess(credential: string) {
    setErro('')
    try {
      await signInWithGoogle(credential)
      router.push('/')
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Não foi possível entrar com o Google.'))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-6">
        <div className="w-full max-w-[420px]">
          <Logo variant="full" className="mb-8" />

          <h1 className="text-[28px] font-bold text-horta-dark text-center">Bem-vindo(a)!</h1>
          <p className="text-ink-500 text-sm text-center mt-2 leading-relaxed">
            Entre para acessar produtos frescos direto da nossa
            <br />
            unidade rural.
          </p>

          {erro && (
            <div className="mt-5 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm text-center">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowSenha((v) => !v)}
                  className="text-ink-400 hover:text-horta-medium transition-colors"
                  aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            <div className="text-center">
              <Link href="/esqueci-senha" className="text-horta-dark text-sm font-medium hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            <PrimaryButton type="submit" loading={loading}>
              Entrar
            </PrimaryButton>
          </form>

          <OrDivider />

          <GoogleSignInButton
            label="Entrar com Google"
            onSuccess={handleGoogleSuccess}
            onError={() => setErro('Não foi possível entrar com o Google.')}
          />

          <p className="text-center text-sm text-ink-500 mt-6">
            Ainda não tem uma conta?{' '}
            <Link href="/cadastro" className="text-horta-dark font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      <DecorativeStrip />
    </div>
  )
}
