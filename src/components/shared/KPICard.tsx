import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { KPI } from '@/types/creditRisk'
import { SIGNAL_COLORS } from '@/lib/signals'
import MiniSparkline from './MiniSparkline'

const ACCENT_COLORS: Record<string, string> = {
  blue: '#D71920',
  cyan: '#C6A15B',
  violet: '#8F969E',
  amber: '#F59E0B',
  green: '#10B981',
  red: '#EF4444',
}

export default function KPICard({ kpi }: { kpi: KPI }) {
  const accentColor = ACCENT_COLORS[kpi.accent] ?? '#D71920'
  const signalColor = SIGNAL_COLORS[kpi.signal]

  return (
    <div
      className={clsx(
        'card card-hover relative overflow-hidden animate-fade-in',
        'flex flex-col gap-3 p-4'
      )}
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 40% at 100% 0%, ${accentColor}08, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 relative">
        <span className="text-text-secondary text-xs font-medium leading-tight">{kpi.label}</span>
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5"
          style={{ backgroundColor: signalColor, boxShadow: `0 0 6px ${signalColor}60` }}
        />
      </div>

      {/* Value */}
      <div className="relative">
        <div className="font-mono text-2xl font-semibold text-text-primary tabular-nums leading-none">
          {kpi.value}
        </div>
        {kpi.description && (
          <div className="text-text-muted text-[10px] mt-0.5 leading-tight">{kpi.description}</div>
        )}
      </div>

      {/* Variation + sparkline */}
      <div className="flex items-end justify-between gap-2 relative">
        <div className="flex items-center gap-1">
          {kpi.variationDirection === 'up' && (
            <TrendingUp size={11} className={kpi.signal === 'green' ? 'text-signal-green' : 'text-signal-amber'} />
          )}
          {kpi.variationDirection === 'down' && (
            <TrendingDown size={11} className={kpi.signal === 'green' ? 'text-signal-green' : 'text-signal-red'} />
          )}
          {kpi.variationDirection === 'flat' && <Minus size={11} className="text-text-muted" />}
          <span
            className={clsx(
              'text-[11px] font-medium font-mono',
              kpi.signal === 'green' ? 'text-signal-green' : kpi.signal === 'amber' ? 'text-signal-amber' : 'text-signal-red'
            )}
          >
            {kpi.variation}
          </span>
        </div>
        <MiniSparkline data={kpi.sparkline} color={accentColor} />
      </div>
    </div>
  )
}
