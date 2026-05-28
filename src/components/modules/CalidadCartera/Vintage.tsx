import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import HeatmapCell from '@/components/shared/HeatmapCell'
import ChartContainer from '@/components/shared/ChartContainer'
import { vintageData, vintageColumns, vintageBenchmark } from '@/data/mockData'

const COHORT_COLORS = ['#D71920', '#C6A15B', '#8F969E', '#F59E0B', '#10B981', '#EF4444']

export default function Vintage() {
  // Build line chart data
  const lineData = vintageColumns.map((_, ci) => {
    const point: Record<string, number | null> = { index: ci }
    vintageData.forEach(row => {
      point[row.cohort] = row.values[ci] ?? null
    })
    point['Benchmark'] = vintageBenchmark[ci]
    return point
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Heatmap */}
      <ChartContainer title="Heatmap de Cosechas" subtitle="Mora acumulada % por cohort y maduration">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-text-muted font-medium py-2 pr-3 text-[11px]">Cosecha</th>
                {vintageColumns.map(c => (
                  <th key={c} className="text-text-muted font-medium text-[11px] px-1 text-center">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vintageData.map(row => (
                <tr key={row.cohort} className="hover:bg-bg-elevated/30 transition-colors">
                  <td className="py-1.5 pr-3 text-text-secondary text-[11px] font-medium whitespace-nowrap">{row.cohort}</td>
                  {row.values.map((v, i) => (
                    <HeatmapCell key={i} value={v} min={0} max={7} />
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border-subtle/50">
                <td className="py-1.5 pr-3 text-text-muted text-[11px] italic">Benchmark</td>
                {vintageBenchmark.map((v, i) => (
                  <HeatmapCell key={i} value={v} min={0} max={7} />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-2 rounded-sm" style={{ background: 'linear-gradient(to right, #10B981, #F59E0B, #EF4444)' }} />
            <span>0% → 3.5% → 7%+</span>
          </div>
        </div>
      </ChartContainer>

      {/* Line chart */}
      <ChartContainer title="Curvas de Maduración" subtitle="Mora acumulada % por maduration point">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="index"
              type="number"
              ticks={vintageColumns.map((_, i) => i)}
              tickFormatter={i => vintageColumns[i]}
              tick={{ fontSize: 10, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
              formatter={v => {
                const n = Number(v)
                return [Number.isFinite(n) ? `${n.toFixed(1)}%` : '—']
              }}
              labelFormatter={i => vintageColumns[i as number]}
            />
            <ReferenceLine y={2} stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Umbral 2%', fill: '#F59E0B', fontSize: 9, position: 'right' }} />
            {vintageData.map((row, i) => (
              <Line
                key={row.cohort}
                type="monotone"
                dataKey={row.cohort}
                stroke={COHORT_COLORS[i]}
                strokeWidth={1.5}
                dot={{ r: 3, fill: COHORT_COLORS[i] }}
                connectNulls={false}
              />
            ))}
            <Line
              type="monotone"
              dataKey="Benchmark"
              stroke="#64748B"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
