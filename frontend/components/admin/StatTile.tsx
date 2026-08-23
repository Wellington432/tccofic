import { LucideIcon } from 'lucide-react'

type Tone = 'default' | 'good' | 'warning' | 'critical'

const TONE_STYLES: Record<Tone, { bg: string; fg: string }> = {
  default: { bg: 'bg-horta-medium/10', fg: 'text-horta-dark' },
  good: { bg: 'bg-[#0ca30c]/10', fg: 'text-[#0ca30c]' },
  warning: { bg: 'bg-[#fab219]/15', fg: 'text-[#a86a00]' },
  critical: { bg: 'bg-[#d03b3b]/10', fg: 'text-[#d03b3b]' },
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
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  )
}
