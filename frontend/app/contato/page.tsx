import { Mail, MapPin, Phone } from 'lucide-react'
import AppShell from '@/components/AppShell'

const CONTACTS = [
  { icon: MapPin, label: 'Unidade Rural ETEC Jales — Jales, SP' },
  { icon: Phone, label: '(17) 0000-0000' },
  { icon: Mail, label: 'contato@feiraetec.com.br' },
]

export default function ContatoPage() {
  return (
    <AppShell title="Contato">
      <div className="bg-white rounded-card border border-card-border shadow-card p-6 max-w-md space-y-4">
        {CONTACTS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-9 h-9 rounded-full bg-horta-medium/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-horta-medium" />
            </div>
            {label}
          </div>
        ))}
      </div>
    </AppShell>
  )
}
