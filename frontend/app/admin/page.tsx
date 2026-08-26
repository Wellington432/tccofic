'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, DollarSign, CheckCircle2, Clock, XCircle, Boxes } from 'lucide-react'
import AdminShell from '@/components/admin/AdminShell'
import StatTile from '@/components/admin/StatTile'
import LineChart from '@/components/admin/LineChart'
import BarChart from '@/components/admin/BarChart'
import { api, getApiErrorMessage } from '@/lib/api'
import { Produto, RelatorioVendas } from '@/lib/types'
import { formatPrice } from '@/lib/format'

const PERIODOS = [7, 30, 90] as const
const ESTOQUE_BAIXO_LIMIAR = 10

function AdminDashboardContent() {
  const [periodo, setPeriodo] = useState<(typeof PERIODOS)[number]>(30)
  const [relatorio, setRelatorio] = useState<RelatorioVendas | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([
      api.get<RelatorioVendas>('/relatoriovendas', { params: { dias: periodo } }),
      api.get<Produto[]>('/listproduto'),
    ])
      .then(([relatorioRes, produtosRes]) => {
        if (!active) return
        setRelatorio(relatorioRes.data)
        setProdutos(produtosRes.data)
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err, 'Não foi possível carregar o dashboard.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [periodo])

  const estoqueData = [...produtos]
    .sort((a, b) => a.estoque - b.estoque)
    .slice(0, 8)
    .map((p) => ({ label: p.nome, value: p.estoque, critical: p.estoque <= ESTOQUE_BAIXO_LIMIAR }))

  const produtosMaisVendidosData =
    relatorio?.produtos_mais_vendidos.map((p) => ({ label: p.nome, value: p.quantidade })) ?? []

  return (
    <AdminShell title="Dashboard">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-input bg-brand-red/10 border border-brand-red/25 text-brand-red text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-sm text-ink-500 mr-1">Período:</span>
        {PERIODOS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriodo(p)}
            className={`h-9 px-4 rounded-input text-sm font-medium border transition-colors ${
              periodo === p
                ? 'bg-horta-dark text-white border-horta-dark'
                : 'border-input-border text-ink-600 hover:bg-bg-app'
            }`}
          >
            {p} dias
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-card border border-card-border animate-pulse" />
          ))}
        </div>
      )}

      {!loading && relatorio && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile
              label={`Receita (${relatorio.periodo_dias} dias)`}
              value={formatPrice(relatorio.receita_total)}
              icon={DollarSign}
            />
            <StatTile
              label="Pedidos finalizados"
              value={String(relatorio.pedidos_finalizados)}
              icon={CheckCircle2}
              tone="good"
            />
            <StatTile
              label="Aguardando pagamento"
              value={String(relatorio.pedidos_aguardando_pagamento)}
              icon={Clock}
              tone="warning"
            />
            <StatTile
              label="Cancelados"
              value={String(relatorio.pedidos_cancelados)}
              icon={XCircle}
              tone="critical"
            />
          </div>

          <LineChart
            title={`Receita por dia — últimos ${relatorio.periodo_dias} dias`}
            data={relatorio.receita_por_dia}
            valueFormatter={(v) => formatPrice(v)}
          />

          <div className="grid lg:grid-cols-2 gap-6">
            <BarChart
              title="Produtos mais vendidos no período"
              data={produtosMaisVendidosData}
              emptyMessage="Nenhuma venda finalizada no período."
            />
            <BarChart
              title="Estoque mais baixo"
              data={estoqueData}
              emptyMessage="Nenhum produto cadastrado."
              criticalLegendLabel={`Estoque ≤ ${ESTOQUE_BAIXO_LIMIAR} — repor`}
            />
          </div>
        </>
      )}

      {!loading && produtos.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <Boxes className="w-10 h-10 text-ink-300" />
          <p className="text-ink-400 text-sm">Cadastre produtos para ver os gráficos de estoque.</p>
        </div>
      )}
    </AdminShell>
  )
}

export default function AdminDashboardPage() {
  return <AdminDashboardContent />
}
