import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ComposedChart, Line,
} from 'recharts'
import ChartContainer from '@/components/shared/ChartContainer'
import { netflowData } from '@/data/mockData'
import { byPeriod, riskAdjusted } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'

const buildWaterfallData = (data: typeof netflowData) => data.map(d => {
  const netColor = d.netflow >= 0 ? '#EF4444' : '#10B981'
  return {
    mes: d.month,
    entradas: d.entradas,
    curas: -d.curas,
    castigos: -d.castigos,
    netflow: d.netflow,
    netflowColor: netColor,
    acumulado: d.acumulado,
  }
})

const consecutivePositive = (data: typeof netflowData) => {
  let current = 0
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].netflow > 0) current++
    else break
  }
  return current
}

export default function Netflow() {
  const { filters } = useFilters()
  const visibleData = byPeriod(netflowData, filters).map(d => ({
    ...d,
    entradas: riskAdjusted(d.entradas, filters),
    curas: riskAdjusted(d.curas, filters),
    castigos: riskAdjusted(d.castigos, filters),
    netflow: riskAdjusted(d.netflow, filters),
    acumulado: riskAdjusted(d.acumulado, filters),
  }))
  const waterfallData = buildWaterfallData(visibleData)
  const streak = consecutivePositive(visibleData)
  const isAlert = streak >= 2

  return (
    <div className="space-y-4">
      {/* Alert banner */}
      {isAlert && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-signal-amber/10 border border-signal-amber/30">
          <span className="text-signal-amber text-xs font-bold">⚠️</span>
          <div>
            <p className="text-text-primary text-sm font-medium">Netflow positivo {streak} meses consecutivos</p>
            <p className="text-text-muted text-xs mt-0.5">Entradas a mora superan curas+castigos — revisar segmento Score C</p>
          </div>
        </div>
      )}

      <ChartContainer title="Waterfall de Netflow" subtitle="Entradas, Curas, Castigos y Netflow mensual ($M)">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={waterfallData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
            <Tooltip
              contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
              formatter={(value: number) => [`$${Math.abs(value).toFixed(1)}M`]}
            />
            <Legend wrapperStyle={{ fontSize: '10px', color: '#94A3B8', paddingTop: '8px' }} iconType="square" iconSize={8} />
            <Bar dataKey="entradas" name="Entradas en mora" fill="#EF4444" radius={[3, 3, 0, 0]} />
            <Bar dataKey="curas" name="Curas" fill="#10B981" radius={[3, 3, 0, 0]} />
            <Bar dataKey="castigos" name="Castigos" fill="#64748B" radius={[3, 3, 0, 0]} />
            <ReferenceLine y={0} stroke="#3A3D44" strokeOpacity={0.6} />
            <Line type="monotone" dataKey="acumulado" name="Acumulado" stroke="#D71920" strokeWidth={2} dot={{ r: 3, fill: '#D71920' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Netflow detail table */}
      <ChartContainer title="Detalle Mensual" subtitle="Últimos 12 meses" minHeight={0}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle/50">
                <th className="text-left text-text-muted font-medium py-2 text-[11px]">Mes</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Entradas</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Curas</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Castigos</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Netflow</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map(d => (
                <tr key={d.month} className="border-b border-border-subtle/20 hover:bg-bg-elevated/20 transition-colors">
                  <td className="py-2 text-text-primary font-medium">{d.month}</td>
                  <td className="py-2 text-text-primary font-mono text-right">${d.entradas}M</td>
                  <td className="py-2 text-text-primary font-mono text-right">${d.curas}M</td>
                  <td className="py-2 text-text-primary font-mono text-right">${d.castigos}M</td>
                  <td className="py-2 font-mono font-semibold text-right" style={{ color: d.netflow >= 0 ? '#EF4444' : '#10B981' }}>
                    {d.netflow >= 0 ? '+' : ''}${d.netflow}M
                  </td>
                  <td className="py-2 font-mono text-right" style={{ color: d.acumulado > 0 ? '#F59E0B' : '#10B981' }}>
                    ${d.acumulado}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>
    </div>
  )
}
