'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AlertTriangle, PackageOpen } from 'lucide-react'
import AppShell from '@/components/AppShell'
import { api, getApiErrorMessage } from '@/lib/api'
import { Compra, StatusCompra } from '@/lib/types'
import { formatPrice } from '@/lib/format'

const STATUS_LABEL: Record<StatusCompra, string> = {
  CARRINHO: 'No carrinho',
  AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
  FINALIZADA: 'Finalizado',
  CANCELADA: 'Cancelado',
  ENTREGUE: 'Entregue',
}

const STATUS_COLOR: Record<StatusCompra, string> = {
  CARRINHO: 'bg-gray-100 text-gray-600',
  AGUARDANDO_PAGAMENTO: 'bg-brand-yellow/20 text-yellow-700',
  FINALIZADA: 'bg-horta-medium/15 text-horta-dark',
  CANCELADA: 'bg-red-50 text-brand-red',
  ENTREGUE: 'bg-horta-medium/15 text-horta-dark',
}

function PedidoSkeleton() {
  return (
    <div className="bg-white rounded-card border border-card-border shadow-card p-4 space-y-3">
      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
      <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
    </div>
  )
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Compra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<Compra[]>('/meuspedidos')
      .then(({ data }) => setPedidos(data))
      .catch((err) => setError(getApiErrorMessage(err, 'Não foi possível carregar seus pedidos.')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppShell title="Meus pedidos">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-input bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <PedidoSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && pedidos.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <PackageOpen className="w-10 h-10 text-gray-300" />
          <p className="text-gray-400 text-sm">Você ainda não fez nenhum pedido.</p>
        </div>
      )}

      <div className="space-y-3">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-card border border-card-border shadow-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[pedido.status]}`}>
                {STATUS_LABEL[pedido.status]}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3 overflow-x-auto">
              {pedido.itens.map((item) => (
                <div key={item.id} className="relative w-12 h-12 rounded-input overflow-hidden bg-bg-app shrink-0">
                  {item.produto.banner && (
                    <Image src={item.produto.banner} alt={item.produto.nome} fill className="object-cover" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-500">{pedido.itens.length} item(ns)</span>
              <span className="font-bold text-horta-dark">{formatPrice(pedido.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
