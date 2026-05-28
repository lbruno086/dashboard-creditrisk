import type { FilterState, Product, ScoreSegment } from '@/types/creditRisk'

const PRODUCT_MULTIPLIER: Record<Product | 'todos', number> = {
  todos: 1,
  tarjeta: 1.08,
  prestamo_personal: 1.14,
  hipotecario: 0.72,
  automotriz: 0.9,
}

const SEGMENT_MULTIPLIER: Record<ScoreSegment | 'todos', number> = {
  todos: 1,
  A: 0.55,
  B: 0.9,
  C: 1.45,
  D: 2.2,
}

export function periodLimit(filters: FilterState): number {
  switch (filters.period) {
    case '30d':
      return 1
    case '3M':
      return 3
    case '6M':
      return 6
    case 'YTD':
      return 5
    case '12M':
    default:
      return 12
  }
}

export function byPeriod<T>(data: T[], filters: FilterState): T[] {
  return data.slice(-periodLimit(filters))
}

export function riskAdjusted(value: number, filters: FilterState): number {
  return +(value * PRODUCT_MULTIPLIER[filters.product] * SEGMENT_MULTIPLIER[filters.segment]).toFixed(2)
}

export function volumeAdjusted(value: number, filters: FilterState): number {
  const segmentShare = filters.segment === 'todos' ? 1 : { A: 0.32, B: 0.38, C: 0.22, D: 0.08 }[filters.segment]
  return +(value * segmentShare).toFixed(2)
}

export function filterLabel(filters: FilterState): string {
  const product = filters.product === 'todos' ? 'todos los productos' : filters.product
  const segment = filters.segment === 'todos' ? 'todos los segmentos' : `Score ${filters.segment}`
  return `Vista: ${filters.period} - ${product} - ${segment}`
}
