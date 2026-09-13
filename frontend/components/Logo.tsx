import Image from 'next/image'

const DARK = '#14532D'
const RED = '#D32F2F'

interface LogoProps {
  variant?: 'full' | 'compact'
  className?: string
}

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <Image src="/logo-icon.png" alt="FeiraEtec" width={54} height={40} priority className="w-[54px] h-auto" />
        <div className="leading-tight">
          <div className="font-bold text-lg">
            <span style={{ color: DARK }}>Feira</span>
            <span style={{ color: RED }}>Etec</span>
          </div>
          <div className="text-[9px] font-semibold tracking-wide text-ink-400 -mt-0.5">
            UNIDADE RURAL
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Image
        src="/logo-full.png"
        alt="FeiraEtec — Produtos da Unidade Rural, ETEC Jales"
        width={272}
        height={258}
        priority
        className="w-[272px] h-auto"
      />
    </div>
  )
}
