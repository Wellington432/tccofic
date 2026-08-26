import { LucideIcon } from 'lucide-react'

type Tone = 'default' | 'good' | 'warning' | 'critical'

const TONE_STYLES: Record<Tone, { bg: string; fg: string }> = {
  default: { bg: 'bg-horta-medium/10', fg: 'text-horta-dark' },
  good: { bg: 'bg-success/10', fg: 'text-success' },
  warning: { bg: 'bg-warning/15', fg: 'text-warning-ink' },
  critical: { bg: 'bg-brand-red/10', fg: 'text-brand-red' },
}

interface StatTileProps {
  label: string
  value: string
  icon: LucideIcon
  tone?: Tone
}

export default function StatTile({ label, value, icon: Icon, tone = 'default' }: StatTileProps) {
  const { bg, fg } = TONE_STYLES[tone]

  return (
    <div className="bg-white rounded-card border border-card-border shadow-card p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${fg}`} />
      </div>
      <div>
        <p className="text-sm text-ink-500">{label}</p>
        <p className="text-2xl font-semibold text-ink-800 mt-0.5">{value}</p>
      </div>
    </div>
  )
}
