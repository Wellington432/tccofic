'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AlertTriangle, Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { useCart } from '@/contexts/CartContext'
import { api, getApiErrorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { TipoEntrega } from '@/lib/types'
import PrimaryButton from '@/components/PrimaryButton'

export default function CarrinhoPage() {
  const { cart, loading, updateItem, removeItem, refresh } = useCart()
  const [error, setError] = useState('')
  const [busyItemId, setBusyItemId] = useState<string | null>(null)
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('RETIRADA')
  const [endereco, setEndereco] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  async function handleQuantityChange(id: string, quantidade: number) {
    if (quantidade < 1) return
    setBusyItemId(id)
    setError('')
    try {
      await updateItem(id, quantidade)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível atualizar o item.'))
    } finally {
      setBusyItemId(null)
    }
  }

  async function handleRemove(id: string) {
    setBusyItemId(id)
    setError('')
    try {
      await removeItem(id)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível remover o item.'))
    } finally {
      setBusyItemId(null)
    }
  }

  async function handleCheckout() {
    if (!cart) return
    if (tipoEntrega === 'ENTREGA' && !endereco.trim()) {
      setError('Informe o endereço para entrega.')
      return
    }
    setCheckoutLoading(true)
    setError('')
    try {
      const { data } = await api.post<{ checkout_url: string }>('/checkout', {
        id_compra: cart.id,
        tipo_entrega: tipoEntrega,
        endereco: tipoEntrega === 'ENTREGA' ? endereco : undefined,
      })
      await refresh()
      window.location.href = data.checkout_url
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível iniciar o pagamento.'))
    } finally {
      setCheckoutLoading(false)
    }
  }

  const total = cart?.itens.reduce((soma, item) => soma + Number(item.produto.preco) * item.quantidade, 0) ?? 0

  return (
    <AppShell title="Meu carrinho">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && !cart && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-card border border-card-border animate-pulse" />
          ))}
        </div>
      )}

      {!loading && cart && cart.itens.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <ShoppingBag className="w-10 h-10 text-ink-300" />
          <p className="text-ink-400 text-sm">Seu carrinho está vazio.</p>
        </div>
      )}

      {cart && cart.itens.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {cart.itens.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-card border border-card-border shadow-card p-3 flex items-center gap-4"
              >
                <div className="relative w-16 h-16 rounded-input overflow-hidden bg-bg-app shrink-0">
                  {item.produto.banner && (
                    <Image src={item.produto.banner} alt={item.produto.nome} fill className="object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-ink-800 truncate">{item.produto.nome}</h3>
                  <span className="text-xs text-ink-400">{item.produto.unidade}</span>
                  <span className="block font-bold text-horta-dark text-sm mt-0.5">
                    {formatPrice(item.produto.preco)}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={busyItemId === item.id}
                    onClick={() => handleQuantityChange(item.id, item.quantidade - 1)}
                    className="w-7 h-7 rounded-full border border-input-border flex items-center justify-center text-ink-500 hover:bg-bg-app disabled:opacity-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {busyItemId === item.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : item.quantidade}
                  </span>
                  <button
                    type="button"
                    disabled={busyItemId === item.id}
                    onClick={() => handleQuantityChange(item.id, item.quantidade + 1)}
                    className="w-7 h-7 rounded-full border border-input-border flex items-center justify-center text-ink-500 hover:bg-bg-app disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={busyItemId === item.id}
                  onClick={() => handleRemove(item.id)}
                  className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-brand-red hover:bg-brand-red/10 disabled:opacity-50"
                  aria-label="Remover item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-card border border-card-border shadow-card p-5 space-y-4">
            <h3 className="font-semibold text-ink-800">Entrega</h3>

            <div className="flex gap-2">
              {(['RETIRADA', 'ENTREGA'] as TipoEntrega[]).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setTipoEntrega(tipo)}
                  className={`flex-1 h-10 rounded-input text-sm font-medium border transition-colors ${
                    tipoEntrega === tipo
                      ? 'bg-horta-dark text-white border-horta-dark'
                      : 'border-input-border text-ink-600 hover:bg-bg-app'
                  }`}
                >
                  {tipo === 'RETIRADA' ? 'Retirada' : 'Entrega'}
                </button>
              ))}
            </div>

            {tipoEntrega === 'ENTREGA' && (
              <input
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço completo"
                className="w-full h-12 rounded-input border border-input-border px-4 text-sm outline-none focus:border-horta-medium"
              />
            )}

            <div className="flex items-center justify-between pt-2 border-t border-card-border">
              <span className="text-sm text-ink-500">Total</span>
              <span className="font-bold text-lg text-horta-dark">{formatPrice(total)}</span>
            </div>

            <PrimaryButton onClick={handleCheckout} loading={checkoutLoading}>
              Finalizar pedido
            </PrimaryButton>
          </div>
        </div>
      )}
    </AppShell>
  )
}
