import Image from 'next/image'

export default function LeafWatermark() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 h-64 overflow-hidden -z-10"
      aria-hidden="true"
    >
      <Image
        src="/produce/ramo_folhas.png"
        alt=""
        width={307}
        height={280}
        className="absolute -bottom-10 -left-8 w-64 h-auto opacity-[0.07] rotate-12"
      />
      <Image
        src="/produce/ramo_folhas.png"
        alt=""
        width={307}
        height={280}
        className="absolute -bottom-16 right-0 w-72 h-auto opacity-[0.06] -rotate-[100deg] scale-x-[-1]"
      />
      <Image
        src="/produce/ramo_folhas.png"
        alt=""
        width={307}
        height={280}
        className="absolute bottom-6 left-1/3 w-40 h-auto opacity-[0.06] rotate-45"
      />
    </div>
  )
}
