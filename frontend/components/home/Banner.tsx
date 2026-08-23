'use client'

import { useState } from 'react'
import Link from 'next/link'
import CrateIllustration from './CrateIllustration'

const SLIDE_COUNT = 3

export default function Banner() {
  const [active, setActive] = useState(0)

  return (
    <div className="relative rounded-card overflow-hidden bg-gradient-to-br from-horta-medium/15 via-horta-medium/10 to-brand-yellow/10 p-6 sm:p-8 lg:p-10 flex items-center gap-6">
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-horta-dark leading-[1.15] text-2xl sm:text-3xl lg:text-[40px]">
          Hortifruti
          <br />
          Fresco e de
          <br />
          Qualidade!
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-xs">
          Produtos colhidos com cuidado e dedicação para sua mesa.
        </p>
        <Link
          href="/categorias"
          className="inline-block mt-5 h-12 px-6 rounded-input bg-horta-dark text-white text-sm font-semibold leading-[48px] hover:bg-[#0f4023] transition-colors"
        >
          Ver produtos
        </Link>

        <div className="flex items-center gap-1.5 mt-6">
          {[...Array(SLIDE_COUNT)].map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? 'w-6 bg-horta-medium' : 'w-1.5 bg-horta-medium/30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden sm:block w-40 lg:w-56 shrink-0">
        <CrateIllustration />
      </div>
    </div>
  )
}
