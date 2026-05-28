import { SIGNAL_COLORS } from '@/lib/signals'
import type { SignalLevel } from '@/types/creditRisk'

interface Props {
  label: string
  customers: number
  conversionRate?: number
  benchmark?: number
  signal: SignalLevel
  ingreso?: string
  note?: string
}

const fmt = (n: number) => n.toLocaleString('en-US')

export default function FunnelStage({ label, customers, conversionRate, benchmark, signal, ingreso, note }: Props) {
  const color = SIGNAL_COLORS[signal]
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border-subtle bg-bg-elevated/30">
      {/* Color indicator */}
      <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />

      {/* Stage info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-text-primary text-sm font-medium">{label}</span>
          {note && <span className="text-text-muted text-[10px] italic">{note}</span>}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="font-mono text-lg font-semibold text-text-primary tabular-nums">{fmt(customers)}</span>
          {conversionRate !== undefined && (
            <span className="chip bg-bg-card border border-border-subtle">
              <span className="text-text-muted">Conv:</span>
              <span className="text-text-primary font-semibold">{conversionRate.toFixed(1)}%</span>
              {benchmark && (
                <span className={`text-[10px] ${conversionRate >= benchmark ? 'text-signal-green' : 'text-signal-red'}`}>
                  (bench {benchmark}%)
                </span>
              )}
            </span>
          )}
          {ingreso && <span className="text-accent-blue text-xs font-medium">{ingreso}</span>}
        </div>
      </div>

      {/* Signal */}
      <div className="w-2 h-2 rounded-full flex-shrink-0 ring-2" style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties} />
    </div>
  )
}
