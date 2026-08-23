import { Leaf } from 'lucide-react'

export default function LeafWatermark() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 h-64 overflow-hidden -z-10"
      aria-hidden="true"
    >
      <Leaf className="absolute -bottom-10 -left-8 w-64 h-64 text-horta-medium/[0.06] rotate-12" />
      <Leaf className="absolute -bottom-16 right-0 w-72 h-72 text-horta-medium/[0.05] -rotate-12" />
      <Leaf className="absolute bottom-6 left-1/3 w-40 h-40 text-horta-medium/[0.05] rotate-45" />
    </div>
  )
}
