import { ShoppingCart, Leaf } from 'lucide-react'

const DARK = '#14532D'
const MEDIUM = '#2E7D32'
const RED = '#D32F2F'
const YELLOW = '#FBC02D'

function LogoIcon({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* céu / base circular sutil */}
      <circle cx="100" cy="100" r="96" fill="#FBFAF6" />

      {/* faixas de plantação, correndo por trás em toda a largura */}
      <path d="M-10 150 Q 50 130 100 148 Q 150 166 210 146 V210 H-10 Z" fill={MEDIUM} opacity="0.9" />
      <path d="M-10 168 Q 55 152 100 166 Q 145 180 210 164 V210 H-10 Z" fill={DARK} opacity="0.85" />

      {/* sol nascendo, canto superior esquerdo, atrás do celeiro/telefone */}
      <g>
        <circle cx="30" cy="52" r="15" fill={YELLOW} />
        {[0, 45, 90, 135, 180].map((deg) => (
          <line
            key={deg}
            x1="30"
            y1="52"
            x2="30"
            y2="30"
            stroke={YELLOW}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${deg} 30 52)`}
          />
        ))}
      </g>

      {/* celeiro, canto superior direito */}
      <g transform="translate(150 28)">
        <rect x="0" y="16" width="36" height="24" fill="#FFFFFF" stroke={DARK} strokeWidth="3" />
        <path d="M-4 18 L18 -2 L40 18 Z" fill={MEDIUM} stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
        <rect x="14" y="26" width="8" height="14" fill={DARK} />
      </g>

      {/* smartphone, centralizado */}
      <rect x="64" y="58" width="72" height="114" rx="15" fill="#FFFFFF" stroke={DARK} strokeWidth="5" />
      <rect x="75" y="71" width="50" height="72" rx="5" fill="#EEF4E9" />

      {/* muda de 3 folhas dentro da tela */}
      <g transform="translate(100 134)">
        <line x1="0" y1="0" x2="0" y2="-28" stroke={MEDIUM} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-12" cy="-24" rx="11" ry="7" fill={MEDIUM} transform="rotate(-30 -12 -24)" />
        <ellipse cx="12" cy="-24" rx="11" ry="7" fill={DARK} transform="rotate(30 12 -24)" />
        <ellipse cx="0" cy="-36" rx="8" ry="12" fill={MEDIUM} />
      </g>

      {/* carrinho sobreposto na base do celular */}
      <g transform="translate(62 150)">
        <path
          d="M2 2 H14 L21 32 H50 L56 10 H18"
          fill="#FFFFFF"
          stroke={DARK}
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="25" cy="44" r="6" fill={DARK} />
        <circle cx="46" cy="44" r="6" fill={DARK} />
      </g>
    </svg>
  )
}

interface LogoProps {
  variant?: 'full' | 'compact'
  className?: string
}

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <LogoIcon size={40} />
        <div className="leading-tight">
          <div className="font-bold text-lg">
            <span style={{ color: DARK }}>Feira</span>
            <span style={{ color: RED }}>Etec</span>
          </div>
          <div className="text-[9px] font-semibold tracking-wide text-gray-400 -mt-0.5">
            UNIDADE RURAL
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <LogoIcon size={112} />

      <div className="mt-2 font-bold text-3xl leading-none flex items-center">
        <span style={{ color: DARK }}>Fe</span>
        <span className="relative inline-block" style={{ color: DARK }}>
          i
          <Leaf
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-12"
            style={{ color: MEDIUM }}
            fill={MEDIUM}
          />
        </span>
        <span style={{ color: DARK }}>ra</span>
        <span style={{ color: RED }}>Etec</span>
      </div>

      <div className="flex items-center gap-3 w-full max-w-[220px] mt-3">
        <div className="h-px flex-1" style={{ backgroundColor: '#E3E6DE' }} />
        <ShoppingCart className="w-4 h-4 shrink-0" style={{ color: DARK }} />
        <div className="h-px flex-1" style={{ backgroundColor: '#E3E6DE' }} />
      </div>

      <div className="mt-2 text-center leading-tight">
        <div className="text-[10px] font-bold tracking-wider" style={{ color: MEDIUM }}>
          PRODUTOS DA UNIDADE RURAL
        </div>
        <div className="text-[10px] font-bold tracking-wider" style={{ color: RED }}>
          ETEC JALES
        </div>
      </div>
    </div>
  )
}
