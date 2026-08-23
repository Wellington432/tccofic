import { Leaf } from 'lucide-react'
import AppShell from '@/components/AppShell'

export default function SobrePage() {
  return (
    <AppShell title="Sobre nós">
      <div className="bg-white rounded-card border border-card-border shadow-card p-6 max-w-2xl space-y-4">
        <Leaf className="w-8 h-8 text-horta-medium" />
        <p className="text-gray-600 leading-relaxed">
          O FeiraEtec nasceu da Unidade Rural da ETEC Jales, um espaço dedicado ao
          ensino prático de agricultura sustentável. Aqui, alunos e professores
          cultivam hortaliças, frutas e temperos com técnicas de produção própria,
          levando produtos frescos e de qualidade diretamente da horta para a sua
          mesa.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Cada compra apoia o projeto pedagógico da escola e incentiva práticas
          agrícolas responsáveis.
        </p>
      </div>
    </AppShell>
  )
}
