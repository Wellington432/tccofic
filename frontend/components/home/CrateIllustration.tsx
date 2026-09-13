import Image from 'next/image'

export default function CrateIllustration() {
  return (
    <div className="w-full h-full rounded-card-lg overflow-hidden shadow-card">
      <Image
        src="/produce/caixa_hortifruti.png"
        alt="Caixa de hortifrúti fresco"
        width={669}
        height={547}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
