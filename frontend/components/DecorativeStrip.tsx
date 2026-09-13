import Image from 'next/image'

const ITEMS = [
  { src: '/produce/tomates.png', size: 64, offset: 6 },
  { src: '/produce/alface.png', size: 84, offset: -8 },
  { src: '/produce/cenouras.png', size: 60, offset: 10 },
  { src: '/produce/banana.png', size: 80, offset: -6 },
  { src: '/produce/ovos.png', size: 60, offset: 8 },
]

export default function DecorativeStrip() {
  return (
    <div className="relative w-full h-28 sm:h-36 overflow-hidden select-none" aria-hidden="true">
      <div className="absolute inset-x-0 bottom-2 flex items-end justify-center gap-3 sm:gap-5 px-4">
        {ITEMS.map(({ src, size, offset }, i) => (
          <div
            key={i}
            className="rounded-full bg-white shadow-card overflow-hidden shrink-0 flex items-center justify-center"
            style={{ width: size, height: size, transform: `translateY(${offset}px)` }}
          >
            <Image src={src} alt="" width={size} height={size} className="w-[85%] h-[85%] object-contain" />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-bg-app to-transparent" />
    </div>
  )
}
