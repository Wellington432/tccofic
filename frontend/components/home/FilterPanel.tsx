'use client'

import { X } from 'lucide-react'
import { Categoria } from '@/lib/types'

export interface ProductFilters {
  precoMin: string
  precoMax: string
  apenasEstoque: boolean
}

interface FilterPanelProps {
  categorias: Categoria[]
  categoriaId?: string
  onCategoriaChange: (id: string | undefined) => void
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
  onClear: () => void
  onClose: () => void
  className?: string
}

export default function FilterPanel({
  categorias,
  categoriaId,
  onCategoriaChange,
  filters,
  onChange,
  onClear,
  onClose,
  className = '',
}: FilterPanelProps) {
  return (
    <div
      data-filter-panel
      className={`bg-white rounded-card border border-card-border shadow-card-lg p-4 space-y-4 animate-rise-in ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-ink-800">Filtros</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar filtros"
          className="text-ink-400 hover:text-ink-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-500 mb-2">Categoria</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onCategoriaChange(undefined)}
            className={`px-3 h-8 rounded-full text-xs font-medium border transition-colors ${
              !categoriaId
                ? 'bg-horta-dark text-white border-horta-dark'
                : 'border-input-border text-ink-600 hover:bg-bg-app'
            }`}
          >
            Todas
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              onClick={() => onCategoriaChange(categoria.id)}
              className={`px-3 h-8 rounded-full text-xs font-medium border transition-colors ${
                categoriaId === categoria.id
                  ? 'bg-horta-dark text-white border-horta-dark'
                  : 'border-input-border text-ink-600 hover:bg-bg-app'
              }`}
            >
              {categoria.nome}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-500 mb-2">Faixa de preço (R$)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Mín."
            value={filters.precoMin}
            onChange={(e) => onChange({ ...filters, precoMin: e.target.value })}
            className="w-full h-10 rounded-input border border-input-border px-3 text-sm outline-none focus:border-horta-medium"
          />
          <span className="text-ink-400 text-sm shrink-0">até</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Máx."
            value={filters.precoMax}
            onChange={(e) => onChange({ ...filters, precoMax: e.target.value })}
            className="w-full h-10 rounded-input border border-input-border px-3 text-sm outline-none focus:border-horta-medium"
          />
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.apenasEstoque}
          onChange={(e) => onChange({ ...filters, apenasEstoque: e.target.checked })}
          className="w-4 h-4 rounded border-2 border-horta-medium accent-[#14532D]"
        />
        <span className="text-sm text-ink-700">Apenas produtos em estoque</span>
      </label>

      <button
        type="button"
        onClick={onClear}
        className="w-full h-10 rounded-input border border-input-border text-sm font-medium text-ink-600 hover:bg-bg-app transition-colors"
      >
        Limpar filtros
      </button>
    </div>
  )
}
