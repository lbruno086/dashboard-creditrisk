import { createContext, useContext, useState, useCallback } from 'react'
import type { FilterState, Period, Product, ScoreSegment } from '@/types/creditRisk'

interface FiltersContextValue {
  filters: FilterState
  setPeriod: (p: Period) => void
  setProduct: (p: Product | 'todos') => void
  setSegment: (s: ScoreSegment | 'todos') => void
}

export const FiltersContext = createContext<FiltersContextValue | null>(null)

export function useFiltersState(): FiltersContextValue {
  const [filters, setFilters] = useState<FilterState>({
    period: '12M',
    product: 'todos',
    segment: 'todos',
  })

  const setPeriod = useCallback((p: Period) => setFilters(f => ({ ...f, period: p })), [])
  const setProduct = useCallback((p: Product | 'todos') => setFilters(f => ({ ...f, product: p })), [])
  const setSegment = useCallback((s: ScoreSegment | 'todos') => setFilters(f => ({ ...f, segment: s })), [])

  return { filters, setPeriod, setProduct, setSegment }
}

export function useFilters(): FiltersContextValue {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider')
  return ctx
}
