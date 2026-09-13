'use client'

import { Search, SlidersHorizontal } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
  onFilterClick?: () => void
  filterActive?: boolean
  hasActiveFilters?: boolean
}

export default function SearchBar({
  value,
  onChange,
  className = '',
  onFilterClick,
  filterActive = false,
  hasActiveFilters = false,
}: SearchBarProps) {
  return (
    <div
      className={`flex items-center h-14 rounded-full bg-white border border-input-border pl-5 pr-2 gap-2 shadow-card transition-shadow focus-within:shadow-card-lg focus-within:border-horta-medium/40 ${className}`}
    >
      <Search className="w-[18px] h-[18px] text-ink-400 shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Buscar produtos..."
        className="flex-1 min-w-0 h-full bg-transparent outline-none text-[15px] text-ink-700 placeholder:text-ink-400"
      />
      {onFilterClick && (
        <>
          <div className="h-7 w-px bg-input-border shrink-0" />
          <button
            type="button"
            data-filter-toggle
            onClick={onFilterClick}
            className={`relative w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-colors ${
              filterActive ? 'bg-horta-medium/15' : 'hover:bg-bg-app'
            }`}
            aria-label="Filtros"
            aria-expanded={filterActive}
          >
            <SlidersHorizontal className="w-[18px] h-[18px] text-horta-medium" />
            {hasActiveFilters && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-red" />
            )}
          </button>
        </>
      )}
    </div>
  )
}
