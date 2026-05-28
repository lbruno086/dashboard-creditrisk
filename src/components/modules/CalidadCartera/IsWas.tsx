import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts'
import ChartContainer from '@/components/shared/ChartContainer'
import { isWasData, isWasTimeline } from '@/data/mockData'
import { SIGNAL_COLORS, SIGNAL_BG_CLASS, SIGNAL_BORDER } from '@/lib/signals'
import { byPeriod } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'
import type { ScoreSegment } from '@/types/creditRisk'

const SEGMENT_COLORS: Record<ScoreSegment, string> = { A: '#10B981', B: '#F59E0B', C: '#EF4444', D: '#8F969E' }

function Gauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex flex-col items-center">
      <span className="text-text-muted text-xs font-medium mb-1">{label}</span>
      <div className="relative w-20 h-10 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full border-4 border-bg-elevated" style={{ clipPath: 'polygon(0 100%, 0 0, 100% 0, 100% 100%)' }} />
        <div
          className="absolute inset-0 rounded-t-full border-4 border-transparent"
          style={{
            borderColor: color,
            clipPath: `polygon(0 100%, 0 ${100 - pct}%, ${pct}% 0, 100% ${100 - pct}%, 100% 100%)`,
            transform: 'rotate(0deg)',
          }}
        />
      </div>
      <span className="font-mono text-lg font-semibold tabular-nums" style={{ color }}>{value.toFixed(2)}</span>
      <span className="text-text-muted text-[10px]">límite: {max}</span>
    </div>
  )
}

export default function IsWas() {
  const { filters } = useFilters()
  const visibleSegments = filters.segment === 'todos'
    ? isWasData
    : isWasData.filter(d => d.segment === filters.segment)
  const visibleTimeline = byPeriod(isWasTimeline, filters)

  return (
    <div className="space-y-4">
      {/* Gauge row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleSegments.map(d => (
          <div
            key={d.segment}
            className="card card-hover p-4 flex flex-col items-center gap-1 border-l-4"
            style={{ borderLeftColor: SIGNAL_COLORS[d.signal] }}
          >
            <Gauge
              value={d.ratio}
              max={1.3}
              label={`Score ${d.segment}`}
              color={SEGMENT_COLORS[d.segment]}
            />
          </div>
        ))}
      </div>

      {/* Detail table + line chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartContainer title="IS-WAS por Segmento" subtitle="Mora realizada (IS) vs esperada (WAS)" minHeight={0}>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle/50">
                <th className="text-left text-text-muted font-medium py-2 text-[11px]">Segmento</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Mora IS (real)</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Mora WAS (esp.)</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Ratio</th>
                <th className="text-center text-text-muted font-medium py-2 text-[11px]">Estado</th>
              </tr>
            </thead>
            <tbody>
              {visibleSegments.map(d => (
                <tr key={d.segment} className="border-b border-border-subtle/20 hover:bg-bg-elevated/20 transition-colors">
                  <td className="py-2 text-text-primary font-medium">Score {d.segment}</td>
                  <td className="py-2 text-text-primary font-mono text-right">{d.is.toFixed(1)}%</td>
                  <td className="py-2 text-text-primary font-mono text-right">{d.was.toFixed(1)}%</td>
                  <td className="py-2 font-mono font-semibold text-right" style={{ color: SEGMENT_COLORS[d.segment] }}>{d.ratio.toFixed(2)}</td>
                  <td className="py-2 text-center">
                    <span className={`chip ${SIGNAL_BG_CLASS[d.signal]} ${SIGNAL_BORDER[d.signal]} ${d.signal === 'green' ? 'text-signal-green' : d.signal === 'amber' ? 'text-signal-amber' : 'text-signal-red'}`}>
                      {d.signal === 'green' ? '✅ Bajo' : d.signal === 'amber' ? '⚠️ Alerta' : '🔴 Excede'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleSegments.some(d => d.ratio > 1.05) && (
            <div className="mt-3 p-2.5 rounded-lg bg-signal-amber/10 border border-signal-amber/30">
              <p className="text-signal-amber text-xs font-medium">⚠️ Seguimiento requerido</p>
              <p className="text-text-muted text-[10px] mt-0.5">
                Score B tiene ratio 1.09 por tercer mes consecutivo. Score C y D se mantienen elevados.
              </p>
            </div>
          )}
        </ChartContainer>

        <ChartContainer title="Evolución IS/WAS · 12 meses" subtitle="Ratio por segmento">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={visibleTimeline} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} domain={[0.5, 1.25]} />
              <Tooltip
                contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
                formatter={(v: number) => [v.toFixed(2)]}
              />
              <ReferenceLine y={1.0} stroke="#64748B" strokeDasharray="3 3" strokeOpacity={0.4} label={{ value: 'IS=WAS', fill: '#64748B', fontSize: 9, position: 'left' }} />
              <ReferenceLine y={1.05} stroke="#F59E0B" strokeDasharray="3 3" strokeOpacity={0.3} />
              <ReferenceLine y={1.2} stroke="#EF4444" strokeDasharray="3 3" strokeOpacity={0.3} />
              <Legend wrapperStyle={{ fontSize: '10px', color: '#94A3B8', paddingTop: '8px' }} iconType="circle" iconSize={7} />
              {(Object.keys(SEGMENT_COLORS) as ScoreSegment[]).filter(s => filters.segment === 'todos' || filters.segment === s).map(s => (
                <Line key={s} type="monotone" dataKey={s} name={`Score ${s}`} stroke={SEGMENT_COLORS[s]} strokeWidth={1.5} dot={{ r: 2 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
