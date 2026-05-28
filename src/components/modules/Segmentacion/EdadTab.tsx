import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import ChartContainer from '@/components/shared/ChartContainer'
import { ageSegments, ageVsScoreHeatmap } from '@/data/mockData'
import HeatmapCell from '@/components/shared/HeatmapCell'
import { riskAdjusted, volumeAdjusted } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'

const AGE_COLORS = ['#D71920', '#C6A15B', '#8F969E', '#F59E0B', '#10B981']

export default function EdadTab() {
  const { filters } = useFilters()
  const segments = ageSegments.map(a => ({
    ...a,
    pctMora: riskAdjusted(a.pctMora, filters),
    ticketPromedio: volumeAdjusted(a.ticketPromedio, filters),
  }))
  const scoreColumns = filters.segment === 'todos' ? ['A', 'B', 'C', 'D'] as const : [filters.segment] as const
  const groupBarData = segments.map(a => ({
    range: a.range,
    mora: a.pctMora,
    ticket: a.ticketPromedio / 2000,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Donut */}
      <ChartContainer title="Distribución por Edad" subtitle="% de clientes">
        <div className="grid grid-cols-1 gap-2">
          {segments.map((a, i) => (
            <div key={a.range} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: AGE_COLORS[i] }} />
              <span className="text-text-secondary text-xs w-12 flex-shrink-0">{a.range}</span>
              <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${a.pctClientes * 2.5}%`, backgroundColor: AGE_COLORS[i] }} />
              </div>
              <span className="text-text-primary text-xs font-mono font-semibold w-8 text-right">{a.pctClientes}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border-subtle/50">
          <ChartContainer title="Mora y Ticket por Tramo Etario" subtitle="" minHeight={0}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={groupBarData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v * 2).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
                  formatter={(value: number, name: string) => [name === 'mora' ? `${value.toFixed(1)}%` : `$${(value * 2).toFixed(0)}k`, name === 'mora' ? 'Mora' : 'Ticket Prom.']}
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#94A3B8', paddingTop: '8px' }} iconType="square" iconSize={8} />
                <Bar yAxisId="left" dataKey="mora" name="% Mora" fill="#EF4444" radius={[3, 3, 0, 0]} />
                <Bar yAxisId="right" dataKey="ticket" name="Ticket Prom." fill="#C6A15B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </ChartContainer>

      {/* Heatmap: Edad vs Score */}
      <ChartContainer title="Mapa de Calor: Mora por Edad × Score" subtitle="% de mora según segmento y tramo etario">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-text-muted font-medium py-2 pr-4 text-[11px]">Edad \ Score</th>
                {scoreColumns.map(s => (
                  <th key={s} className="text-text-muted font-medium text-[11px] px-1.5 text-center">Score {s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ageVsScoreHeatmap.map(row => (
                <tr key={row.range} className="hover:bg-bg-elevated/20 transition-colors">
                  <td className="py-1.5 pr-4 text-text-secondary text-[11px] font-medium whitespace-nowrap">{row.range}</td>
                  {scoreColumns.map(s => (
                    <HeatmapCell key={s} value={riskAdjusted(row[s], filters)} min={0} max={20} format={v => `${v.toFixed(1)}%`} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-2 rounded-sm" style={{ background: 'linear-gradient(to right, #10B981, #F59E0B, #EF4444)' }} />
            <span>0% → 10% → 20%+</span>
          </div>
        </div>
      </ChartContainer>

      {/* Detail table */}
      <ChartContainer title="Detalle por Tramo Etario" subtitle="Clientes, mora y ticket promedio" className="lg:col-span-2" minHeight={0}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle/50">
                <th className="text-left text-text-muted font-medium py-2 text-[11px]">Tramo</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">% Clientes</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">% Mora</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody>
              {segments.map(a => (
                <tr key={a.range} className="border-b border-border-subtle/20 hover:bg-bg-elevated/20 transition-colors">
                  <td className="py-2 text-text-primary font-medium">{a.range}</td>
                  <td className="py-2 text-text-primary font-mono text-right">{a.pctClientes}%</td>
                  <td className={`py-2 font-mono text-right ${a.pctMora > 5 ? 'text-signal-red' : a.pctMora > 3 ? 'text-signal-amber' : 'text-signal-green'}`}>
                    {a.pctMora.toFixed(1)}%
                  </td>
                  <td className="py-2 font-mono text-right text-accent-cyan font-semibold">${(a.ticketPromedio / 1000).toFixed(0)}k</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>
    </div>
  )
}
