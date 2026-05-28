import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  ScatterChart, Scatter, ZAxis,
} from 'recharts'
import ChartContainer from '@/components/shared/ChartContainer'
import { scoreSegments } from '@/data/mockData'
import { useFilters } from '@/hooks/useFilters'

const SCORE_COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444']

export default function ScoreTab() {
  const { filters } = useFilters()
  const segments = filters.segment === 'todos'
    ? scoreSegments
    : scoreSegments.filter(s => s.segment === filters.segment)
  const scatterData = segments.map(s => ({
    name: `Score ${s.segment}`,
    x: s.segment === 'A' ? 780 : s.segment === 'B' ? 700 : s.segment === 'C' ? 600 : 500,
    y: s.pctMora,
    z: s.pctCartera * 3,
    color: SCORE_COLORS[['A', 'B', 'C', 'D'].indexOf(s.segment)],
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Donut */}
      <ChartContainer title="Distribución por Score" subtitle="% de cartera">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={segments}
              dataKey="pctCartera"
              nameKey="segment"
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={80}
              paddingAngle={3}
              strokeWidth={0}
            >
              {segments.map((_, i) => (
                <Cell key={i} fill={SCORE_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
              formatter={(value: number) => [`${value}%`]}
            />
            <Legend
              wrapperStyle={{ fontSize: '10px', color: '#94A3B8' }}
              iconType="circle" iconSize={7}
              formatter={(value: string) => `Score ${value}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Scatter */}
      <ChartContainer title="Score vs Mora Realizada" subtitle="Burbuja = tamaño de cartera">
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} />
            <XAxis type="number" dataKey="x" name="Score" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey="y" name="Mora %" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <ZAxis type="number" dataKey="z" range={[60, 240]} />
            <Tooltip
              contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
              formatter={(value: number, name: string) => [name === 'Score' ? value : `${value}%`, name]}
            />
            <Scatter data={scatterData} fill="#D71920">
              {scatterData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* NIM vs Cost vs Rentabilidad by score */}
      <ChartContainer title="NIM y Costo de Riesgo por Score" subtitle="Rentabilidad vs riesgo por segmento" className="lg:col-span-2" minHeight={0}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-2">
          {segments.map(s => {
            const color = SCORE_COLORS[['A', 'B', 'C', 'D'].indexOf(s.segment)]
            return (
              <div key={s.segment} className="card p-3" style={{ borderLeft: `3px solid ${color}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-primary text-sm font-semibold">Score {s.segment}</span>
                  <span className="text-text-muted text-[10px]">{s.range}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">% Cartera</span>
                    <span className="text-text-primary font-mono font-semibold">{s.pctCartera}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">% Mora</span>
                    <span className="font-mono font-semibold" style={{ color: s.pctMora > 5 ? '#EF4444' : '#10B981' }}>{s.pctMora.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">NIM</span>
                    <span className="text-accent-cyan font-mono font-semibold">{s.nim.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">Rent. Neta</span>
                    <span className="text-signal-green font-mono font-semibold">{s.rentabilidadNeta.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ChartContainer>
    </div>
  )
}
