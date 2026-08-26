'use client'

import { useId, useState } from 'react'
import { Table2 } from 'lucide-react'

const MARK = '#2E7D32'
const CRITICAL = '#D32F2F'

export interface BarDatum {
  label: string
  value: number
  critical?: boolean
}

interface BarChartProps {
  title: string
  data: BarDatum[]
  valueFormatter?: (value: number) => string
  emptyMessage?: string
  criticalLegendLabel?: string
}

export default function BarChart({
  title,
  data,
  valueFormatter = (v) => String(v),
  emptyMessage = 'Sem dados no período.',
  criticalLegendLabel,
}: BarChartProps) {
  const [showTable, setShowTable] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const uid = useId()

  const max = Math.max(1, ...data.map((d) => d.value))
  const hasCritical = data.some((d) => d.critical)

  return (
    <div className="bg-white rounded-card border border-card-border shadow-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-ink-800 text-sm">{title}</h3>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-horta-dark transition-colors"
          aria-pressed={showTable}
        >
          <Table2 className="w-3.5 h-3.5" />
          {showTable ? 'Ver gráfico' : 'Ver tabela'}
        </button>
      </div>

      {hasCritical && criticalLegendLabel && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CRITICAL }} />
          <span className="text-xs text-ink-400">{criticalLegendLabel}</span>
        </div>
      )}

      {data.length === 0 && <p className="text-sm text-ink-400 py-6 text-center">{emptyMessage}</p>}

      {data.length > 0 && !showTable && (
        <div className="flex flex-col gap-2 mt-3">
          {data.map((d, i) => {
            const pct = (d.value / max) * 100
            const color = d.critical ? CRITICAL : MARK
            return (
              <div
                key={`${uid}-${d.label}`}
                className="relative flex items-center gap-3"
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
              >
                <span className="w-24 shrink-0 text-xs text-ink-500 truncate text-right">{d.label}</span>
                <div className="flex-1 h-6 relative">
                  <div
                    className="h-full max-h-6 transition-[width] duration-300"
                    style={{
                      width: `${pct}%`,
                      minWidth: d.value > 0 ? 4 : 0,
                      backgroundColor: color,
                      borderRadius: '0 4px 4px 0',
                      opacity: hovered === null || hovered === i ? 1 : 0.55,
                    }}
                  />
                </div>
                <span className="w-14 shrink-0 text-xs font-medium text-ink-600 tabular-nums">
                  {valueFormatter(d.value)}
                </span>

                {hovered === i && (
                  <div
                    className="absolute left-24 -top-8 z-10 px-2.5 py-1.5 rounded-md bg-ink-900 text-white text-xs whitespace-nowrap shadow-card-lg pointer-events-none"
                    role="tooltip"
                  >
                    <span className="font-semibold">{valueFormatter(d.value)}</span>
                    <span className="text-white/70"> — {d.label}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {data.length > 0 && showTable && (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs">
                <th className="font-medium pb-2">Item</th>
                <th className="font-medium pb-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.label} className="border-t border-card-border">
                  <td className="py-2 text-ink-700">{d.label}</td>
                  <td className="py-2 text-right tabular-nums text-ink-700">{valueFormatter(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
