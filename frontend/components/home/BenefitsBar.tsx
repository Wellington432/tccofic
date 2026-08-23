import { Truck, Sprout, ShieldCheck, CreditCard } from 'lucide-react'

const BENEFITS = [
  {
    icon: Truck,
    title: 'Entrega rápida',
    desc: 'Produtos frescos da nossa unidade para sua casa',
  },
  {
    icon: Sprout,
    title: 'Produção própria',
    desc: 'Cultivamos com carinho e sustentabilidade',
  },
  {
    icon: ShieldCheck,
    title: 'Qualidade garantida',
    desc: 'Alimentos selecionados para você e sua família',
  },
  {
    icon: CreditCard,
    title: 'Pagamento seguro',
    desc: 'Compre com tranquilidade e segurança',
  },
]

export default function BenefitsBar() {
  return (
    <section className="bg-gray-50 rounded-card p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
      {BENEFITS.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex flex-col items-start gap-2">
          <div className="w-10 h-10 rounded-full bg-horta-medium/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-horta-medium" />
          </div>
          <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 leading-snug">{desc}</p>
        </div>
      ))}
    </section>
  )
}
