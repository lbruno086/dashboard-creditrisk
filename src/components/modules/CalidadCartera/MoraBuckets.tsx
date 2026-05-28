import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import ChartContainer from '@/components/shared/ChartContainer'
import { moraBucketsTimeline, moraBuckets } from '@/data/mockData'
import { byPeriod, riskAdjusted, volumeAdjusted } from '@/lib/filtering'
import { fmtPct } from '@/lib/format'
import { useFilters } from '@/hooks/useFilters'

const BUCKET_COLORS = {
  b1_30: '#D71920',
  b31_60: '#C6A15B',
  b61_90: '#F59E0B',
  b91_180: '#EF4444',
  b180_plus: '#8F969E',
}

const BUCKET_LABELS = {
  b1_30: '1-30 días',
  b31_60: '31-60 días',
  b61_90: '61-90 días',
  b91_180: '91-180 días',
  b180_plus: '180+ días',
}

export default function MoraBuckets() {
  const { filters } = useFilters()
  const timeline = byPeriod(moraBucketsTimeline, filters).map(d => ({
    ...d,
    b31_60: riskAdjusted(d.b31_60, filters),
    b61_90: riskAdjusted(d.b61_90, filters),
    b91_180: riskAdjusted(d.b91_180, filters),
    b180_plus: riskAdjusted(d.b180_plus, filters),
  }))
  const buckets = moraBuckets.map(b => ({
    ...b,
    pct: b.bucket === 'Al día' || b.bucket === '1-30 días' ? b.pct : riskAdjusted(b.pct, filters),
    amount: volumeAdjusted(b.amount, filters),
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Stacked bar */}
      <ChartContainer
        title="Distribución de Mora · 12 meses"
        subtitle="% de cartera en mora por bucket (excluye Al día)"
        className="lg:col-span-2"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={timeline} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
              formatter={(v: number) => [`${v.toFixed(2)}%`]}
            />
            <Legend wrapperStyle={{ fontSize: '10px', color: '#94A3B8', paddingTop: '8px' }} iconType="square" iconSize={8} />
            {(Object.keys(BUCKET_COLORS) as Array<keyof typeof BUCKET_COLORS>).map(key => (
              <Bar key={key} dataKey={key} name={BUCKET_LABELS[key]} stackId="a" fill={BUCKET_COLORS[key]} radius={key === 'b180_plus' ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Bucket detail */}
      <ChartContainer title="Detalle por Bucket" subtitle="Situación actual · Mayo 2026" minHeight={0}>
        <div className="space-y-2">
          {buckets.map(b => (
            <div key={b.bucket} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-text-secondary text-xs">{b.bucket}</span>
                  <span className="text-text-primary text-xs font-mono font-semibold">{fmtPct(b.pct)}</span>
                </div>
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (b.pct / 92.5) * 100)}%`,
                      backgroundColor: b.bucket === 'Al día' ? '#10B981' : b.pct > 1 ? '#EF4444' : '#F59E0B',
                    }}
                  />
                </div>
              </div>
              <span className="text-text-muted text-[10px] font-mono w-16 text-right flex-shrink-0">${b.amount}M</span>
            </div>
          ))}
          <div className="pt-2 border-t border-border-subtle/50">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary font-medium">Mora 30+</span>
              <span className="text-signal-amber font-mono font-bold">3.8%</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-text-secondary font-medium">NPL 90+</span>
              <span className="text-signal-green font-mono font-bold">1.9%</span>
            </div>
          </div>
        </div>
      </ChartContainer>
    </div>
  )
}
