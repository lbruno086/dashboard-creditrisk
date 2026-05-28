import { RefreshCw, Download, ChevronDown } from 'lucide-react'
import { useFilters } from '@/hooks/useFilters'
import type { Period, Product, ScoreSegment } from '@/types/creditRisk'
import clsx from 'clsx'

type DropdownOption<T extends string> = { value: T; label: string }

function FilterDropdown<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: DropdownOption<T>[]
  onChange: (v: T) => void
  label: string
}) {
  const current = options.find(o => o.value === value)
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-text-muted text-xs font-medium hidden lg:block">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className={clsx(
            'appearance-none bg-bg-elevated border border-border-subtle text-text-primary text-xs font-medium',
            'rounded-lg px-3 py-1.5 pr-7 cursor-pointer outline-none',
            'hover:border-accent-blue/40 focus:border-accent-blue/60 transition-colors',
            'font-sans'
          )}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} className="bg-bg-card">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        {/* hidden current label for display */}
        <div className="sr-only">{current?.label}</div>
      </div>
    </div>
  )
}

const PERIODS: DropdownOption<Period>[] = [
  { value: '30d', label: 'Último mes' },
  { value: '3M', label: '3 meses' },
  { value: '6M', label: '6 meses' },
  { value: '12M', label: '12 meses' },
  { value: 'YTD', label: 'YTD' },
]

const PRODUCTS: DropdownOption<Product | 'todos'>[] = [
  { value: 'todos', label: 'Todos los productos' },
  { value: 'tarjeta', label: 'Tarjeta de crédito' },
  { value: 'prestamo_personal', label: 'Préstamo personal' },
  { value: 'hipotecario', label: 'Hipotecario' },
  { value: 'automotriz', label: 'Automotriz' },
]

const SEGMENTS: DropdownOption<ScoreSegment | 'todos'>[] = [
  { value: 'todos', label: 'Todos los segmentos' },
  { value: 'A', label: 'Score A (>750)' },
  { value: 'B', label: 'Score B (650-750)' },
  { value: 'C', label: 'Score C (550-650)' },
  { value: 'D', label: 'Score D (<550)' },
]

export default function Header() {
  const { filters, setPeriod, setProduct, setSegment } = useFilters()

  return (
    <header className="h-16 bg-bg-card/80 backdrop-blur-sm border-b border-border-subtle flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        <FilterDropdown
          label="Período"
          value={filters.period}
          options={PERIODS}
          onChange={setPeriod}
        />
        <div className="w-px h-4 bg-border-subtle hidden sm:block" />
        <FilterDropdown
          label="Producto"
          value={filters.product}
          options={PRODUCTS}
          onChange={setProduct}
        />
        <div className="w-px h-4 bg-border-subtle hidden sm:block" />
        <FilterDropdown
          label="Segmento"
          value={filters.segment}
          options={SEGMENTS}
          onChange={setSegment}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <RefreshCw size={11} className="text-signal-green" />
          <span className="hidden sm:block">Actualizado hace 2 min</span>
        </div>
        <button
          onClick={() => {
            /* no-op */
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-medium hover:bg-accent-blue/20 transition-colors"
        >
          <Download size={12} />
          <span className="hidden sm:block">Exportar</span>
        </button>
      </div>
    </header>
  )
}
