'use client'

import { Search, SlidersHorizontal } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function SearchBar({ value, onChange, className = '' }: SearchBarProps) {
  return (
    <div
      className={`flex items-center h-12 rounded-full bg-white border border-input-border pl-4 pr-2 gap-2 ${className}`}
    >
      <Search className="w-4 h-4 text-gray-400 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Buscar produtos..."
        className="flex-1 min-w-0 h-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
      />
      <div className="h-6 w-px bg-input-border shrink-0" />
      <button
        type="button"
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full hover:bg-bg-app transition-colors"
        aria-label="Filtros"
      >
        <SlidersHorizontal className="w-4 h-4 text-horta-medium" />
      </button>
    </div>
  )
}
