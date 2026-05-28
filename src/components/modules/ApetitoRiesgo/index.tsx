import { Download } from 'lucide-react'
import ChartContainer from '@/components/shared/ChartContainer'
import PageHeader from '@/components/shared/PageHeader'
import SemaforoGauge from '@/components/shared/SemaforoGauge'
import MiniSparkline from '@/components/shared/MiniSparkline'
import { riskAppetite } from '@/data/mockData'
import { signalFor, SIGNAL_COLORS, SIGNAL_TEXT } from '@/lib/signals'
import { byPeriod, filterLabel, riskAdjusted } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'
import type { SignalLevel } from '@/types/creditRisk'

function TrendIndicator({ data, signal }: { data: number[]; signal: SignalLevel }) {
  const last = data[data.length - 1] ?? 0
  const prev = data[data.length - 2] ?? last
  const diff = last - prev
  const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
  const color = direction === 'up'
    ? (signal === 'green' ? '#10B981' : signal === 'amber' ? '#F59E0B' : '#EF4444')
    : direction === 'down'
      ? (signal === 'green' ? '#10B981' : '#64748B')
      : '#64748B'

  return (
    <div className="flex items-center gap-1">
      <svg width="10" height="10" viewBox="0 0 10 10" className="flex-shrink-0">
        {direction === 'up' && <path d="M5 1l4 6H1z" fill={color} />}
        {direction === 'down' && <path d="M5 9l4-6H1z" fill={color} />}
        {direction === 'flat' && <rect x="2" y="4" width="6" height="2" rx="1" fill={color} />}
      </svg>
      <span className="font-mono text-[10px]" style={{ color }}>{diff >= 0 ? '+' : ''}{diff.toFixed(1)}pp</span>
    </div>
  )
}

const historicalMonths = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May']
export default function ApetitoRiesgo() {
  const { filters } = useFilters()
  const indicators = riskAppetite.map(ind => ({
    ...ind,
    current: ind.unit === '%' || ind.unit === 'M' ? riskAdjusted(ind.current, filters) : ind.current,
    trend: byPeriod(ind.trend, filters).map(v => ind.unit === '%' || ind.unit === 'M' ? riskAdjusted(v, filters) : v),
  })).map(ind => ({
    ...ind,
    signal: signalFor(ind.current, { limitMax: ind.limitMax, limitMin: ind.limitMin }),
  }))
  const visibleMonths = byPeriod(historicalMonths, filters)

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Límites de Riesgo"
        subtitle={`Monitoreo de cumplimiento vs. limites de politica crediticia - ${filterLabel(filters)}`}
        right={
          <button
            onClick={() => {/* no-op */}}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-medium hover:bg-accent-blue/20 transition-colors"
          >
            <Download size={12} />
            Exportar Reporte de Límites
          </button>
        }
      />

      {/* RAG grid 4x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {indicators.map(ind => (
          <div
            key={ind.id}
            className="card card-hover p-4 relative overflow-hidden border-l-4"
            style={{ borderLeftColor: SIGNAL_COLORS[ind.signal] }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 60% 40% at 100% 0%, ${SIGNAL_COLORS[ind.signal]}08, transparent 70%)` }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-muted text-xs font-medium">{ind.name}</span>
                <span className={`w-2 h-2 rounded-full ring-2`} style={{ backgroundColor: SIGNAL_COLORS[ind.signal], '--tw-ring-color': SIGNAL_COLORS[ind.signal] } as React.CSSProperties} />
              </div>

              <div className="flex items-center justify-between">
                <SemaforoGauge
                  current={ind.current}
                  max={ind.limitMax}
                  min={ind.limitMin}
                  label=""
                  signal={ind.signal}
                  unit={ind.unit}
                />
                <div className="flex flex-col items-end gap-1">
                  <TrendIndicator data={ind.trend} signal={ind.signal} />
                  <div style={{ width: 56, height: 24 }}>
                    <MiniSparkline data={ind.trend} color={SIGNAL_COLORS[ind.signal]} width={56} height={24} />
                  </div>
                </div>
              </div>

              <p className="text-text-muted text-[10px] mt-2 leading-tight">{ind.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Historical table */}
      <ChartContainer title="Histórico de Indicadores" subtitle="Últimos 6 meses (Dic - May)" minHeight={0}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle/50">
                <th className="text-left text-text-muted font-medium py-2 text-[11px]">Indicador</th>
                {visibleMonths.map(m => (
                  <th key={m} className="text-right text-text-muted font-medium py-2 text-[11px]">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indicators.map(ind => (
                <tr key={ind.id} className="border-b border-border-subtle/20 hover:bg-bg-elevated/20 transition-colors">
                  <td className="py-2 text-text-primary font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SIGNAL_COLORS[ind.signal] }} />
                    {ind.name}
                  </td>
                  {ind.trend.map((v, i) => (
                    <td key={i} className={`py-2 font-mono text-right ${SIGNAL_TEXT[ind.signal]}`}>
                      {v.toFixed(1)}{ind.unit}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>
    </div>
  )
}
