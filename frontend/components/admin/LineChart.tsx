'use client'

import { useMemo, useRef, useState } from 'react'
import { Table2 } from 'lucide-react'

const MARK = '#2E7D32'
const GRID = '#E8EAE3'

export interface LinePoint {
  data: string
  total: number
}

interface LineChartProps {
  title: string
  data: LinePoint[]
  valueFormatter?: (value: number) => string
}

const WIDTH = 640
const HEIGHT = 220
const PAD_LEFT = 48
const PAD_RIGHT = 12
const PAD_TOP = 16
const PAD_BOTTOM = 28

function formatDateLabel(iso: string) {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

export default function LineChart({ title, data, valueFormatter = (v) => String(v) }: LineChartProps) {
  const [showTable, setShowTable] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

  const max = Math.max(1, ...data.map((d) => d.total));
  const niceMax = max <= 0 ? 1 : Math.ceil(max / 4) * 4 || max

  const points = useMemo(
    () =>
      data.map((d, i) => {
        const x = PAD_LEFT + (data.length <= 1 ? 0 : (i / (data.length - 1)) * plotWidth)
        const y = PAD_TOP + plotHeight - (d.total / niceMax) * plotHeight
        return { x, y, ...d }
      }),
    [data, niceMax, plotWidth, plotHeight]
  )

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(PAD_TOP + plotHeight).toFixed(1)} L ${points[0].x.toFixed(1)} ${(PAD_TOP + plotHeight).toFixed(1)} Z`
      : ''

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD_TOP + plotHeight * (1 - t),
    value: niceMax * t,
  }))

  const labelIndexes = useMemo(() => {
    if (data.length === 0) return []
    if (data.length <= 6) return data.map((_, i) => i)
    const step = Math.ceil(data.length / 6)
    const idxs = data.map((_, i) => i).filter((i) => i % step === 0)
    if (idxs[idxs.length - 1] !== data.length - 1) idxs.push(data.length - 1)
    return idxs
  }, [data])

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!svgRef.current || points.length === 0) return
    const rect = svgRef.current.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH
    let nearest = 0
    let nearestDist = Infinity
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relX)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
    })
    setHoverIndex(nearest)
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null
  const last = points[points.length - 1]

  return (
    <div className="bg-white rounded-card border border-card-border shadow-card p-5">
      <div className="flex items-center justify-between mb-3">
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

      {!showTable && (
        <div className="relative w-full" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-full overflow-visible"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
            role="img"
            aria-label={title}
          >
            {gridLines.map((g) => (
              <g key={g.value}>
                <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={g.y} y2={g.y} stroke={GRID} strokeWidth={1} />
                <text x={PAD_LEFT - 8} y={g.y + 3} textAnchor="end" className="fill-ink-400" fontSize={10}>
                  {valueFormatter(g.value)}
                </text>
              </g>
            ))}

            {labelIndexes.map((i) => (
              <text
                key={i}
                x={points[i].x}
                y={HEIGHT - 8}
                textAnchor="middle"
                className="fill-ink-400"
                fontSize={10}
              >
                {formatDateLabel(points[i].data)}
              </text>
            ))}

            {areaPath && <path d={areaPath} fill={MARK} opacity={0.1} stroke="none" />}
            {linePath && <path d={linePath} fill="none" stroke={MARK} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}

            {last && (
              <>
                <circle cx={last.x} cy={last.y} r={4} fill={MARK} stroke="#fff" strokeWidth={2} />
                <text x={last.x} y={last.y - 10} textAnchor="end" fontSize={11} fontWeight={600} className="fill-horta-dark">
                  {valueFormatter(last.total)}
                </text>
              </>
            )}

            {hovered && (
              <g pointerEvents="none">
                <line x1={hovered.x} x2={hovered.x} y1={PAD_TOP} y2={PAD_TOP + plotHeight} stroke={MARK} strokeWidth={1} strokeDasharray="0" opacity={0.35} />
                <circle cx={hovered.x} cy={hovered.y} r={5} fill={MARK} stroke="#fff" strokeWidth={2} />
              </g>
            )}
          </svg>

          {hovered && (
            <div
              className="absolute z-10 px-2.5 py-1.5 rounded-md bg-ink-900 text-white text-xs whitespace-nowrap shadow-card-lg pointer-events-none -translate-x-1/2"
              style={{
                left: `${(hovered.x / WIDTH) * 100}%`,
                top: `${Math.max(0, (hovered.y / HEIGHT) * 100 - 14)}%`,
              }}
              role="tooltip"
            >
              <span className="font-semibold">{valueFormatter(hovered.total)}</span>
              <span className="text-white/70"> — {formatDateLabel(hovered.data)}</span>
            </div>
          )}
        </div>
      )}

      {showTable && (
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs sticky top-0 bg-white">
                <th className="font-medium pb-2">Data</th>
                <th className="font-medium pb-2 text-right">Receita</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.data} className="border-t border-card-border">
                  <td className="py-2 text-ink-700">{formatDateLabel(d.data)}</td>
                  <td className="py-2 text-right tabular-nums text-ink-700">{valueFormatter(d.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
