import { Leaf } from 'lucide-react'
import AppShell from '@/components/AppShell'
import StaticPageHero from '@/components/StaticPageHero'

export default function SobrePage() {
  return (
    <AppShell>
      <StaticPageHero icon={Leaf} title="Sobre nós">
        <p className="text-ink-600 leading-relaxed">
          O FeiraEtec nasceu da Unidade Rural da ETEC Jales, um espaço dedicado ao
          ensino prático de agricultura sustentável. Aqui, alunos e professores
          cultivam hortaliças, frutas e temperos com técnicas de produção própria,
          levando produtos frescos e de qualidade diretamente da horta para a sua
          mesa.
        </p>
        <p className="text-ink-600 leading-relaxed">
          Cada compra apoia o projeto pedagógico da escola e incentiva práticas
          agrícolas responsáveis.
        </p>
      </StaticPageHero>
    </AppShell>
  )
}
