import { rollRateMatrix, rollRateBuckets } from '@/data/mockData'
import ChartContainer from '@/components/shared/ChartContainer'
import { fmtPct } from '@/lib/format'

function rateColor(value: number): string {
  // Positive roll = deterioration (red), negative = cure (green)
  // Values near 0% are neutral/wash
  if (value > 15) return '#EF4444'
  if (value > 8) return '#F97316'
  if (value > 4) return '#F59E0B'
  if (value > 2) return '#22C55E'
  return '#10B981'
}

function transitionColor(from: string, to: string, value: number): string {
  const fromIdx = rollRateBuckets.indexOf(from)
  const toIdx = rollRateBuckets.indexOf(to)
  if (to === 'Cancelado') return '#64748B'
  if (to === 'Castigo') return value >= 2 ? '#EF4444' : '#F97316'
  if (toIdx < fromIdx) return value >= 8 ? '#10B981' : '#22C55E'
  if (toIdx === fromIdx) return '#8F969E'
  return rateColor(value)
}

export default function RollRates() {
  const cureRate = rollRateMatrix
    .filter(r => r.from !== 'Al dia')
    .reduce((sum, r) => sum + (r.to['Al dia'] ?? 0), 0) / (rollRateMatrix.length - 1)

  const avgForwardDeterioration = rollRateMatrix
    .filter(r => r.from !== 'Cancelado')
    .reduce((sum, r) => {
      const keys = Object.keys(r.to)
      const idx = rollRateBuckets.indexOf(r.from)
      const forward = keys
        .filter(k => rollRateBuckets.indexOf(k) > idx && k !== 'Cancelado')
        .reduce((s, k) => s + r.to[k], 0)
      return sum + forward
    }, 0) / rollRateMatrix.length

  return (
    <div className="space-y-4">
      <ChartContainer
        title="Matriz de Roll Rates 30 dias"
        subtitle="Transicion mensual de saldos: bucket al cierre de mes t -> bucket al cierre de t+30 dias (%)"
        minHeight={0}
      >
        <div className="mb-3 rounded-lg border border-border-subtle bg-bg-elevated/30 px-3 py-2 text-[11px] text-text-muted">
          Cada fila suma 100%. Las columnas muestran donde termina la misma cartera 30 dias despues: cura, permanece, deteriora, castiga o cancela.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-text-primary font-semibold py-2 pr-4 text-[11px]">Bucket t \ Bucket t+30d</th>
                {rollRateBuckets.map(b => (
                  <th key={b} className="text-text-muted font-medium text-[11px] px-1.5 py-2 text-center whitespace-nowrap">{b}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rollRateMatrix.map(row => (
                <tr key={row.from} className="hover:bg-bg-elevated/20 transition-colors border-t border-border-subtle/30">
                  <td className="py-1.5 pr-4 text-text-primary text-[11px] font-medium whitespace-nowrap">{row.from}</td>
                  {rollRateBuckets.map(b => {
                    const val = row.to[b] ?? 0
                    return (
                      <td key={b} className="px-1.5 py-1 text-center">
                        <div
                          className="rounded-md px-2 py-1 font-mono text-xs font-semibold text-white tabular-nums mx-auto w-fit"
                          style={{ backgroundColor: transitionColor(row.from, b, val), minWidth: '40px' }}
                        >
                          {fmtPct(val, 1)}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <span className="text-text-muted text-xs font-medium">Cura Rate Promedio</span>
          <div className="font-mono text-xl font-semibold text-signal-green tabular-nums mt-1">
            {cureRate.toFixed(1)}%
          </div>
          <p className="text-text-muted text-[10px] mt-0.5">% que vuelve a Al dia en 30 dias</p>
        </div>
        <div className="card p-4">
          <span className="text-text-muted text-xs font-medium">Roll Forward Rate Prom.</span>
          <div className="font-mono text-xl font-semibold text-signal-amber tabular-nums mt-1">
            {avgForwardDeterioration.toFixed(1)}%
          </div>
          <p className="text-text-muted text-[10px] mt-0.5">% que empeora a buckets superiores en 30 dias</p>
        </div>
        <div className="card p-4">
          <span className="text-text-muted text-xs font-medium">Ratio Cura / Deterioro</span>
          <div className="font-mono text-xl font-semibold tabular-nums mt-1" style={{ color: cureRate > avgForwardDeterioration ? '#10B981' : '#EF4444' }}>
            {(cureRate / avgForwardDeterioration).toFixed(2)}x
          </div>
          <p className="text-text-muted text-[10px] mt-0.5">{'>'}1 = curan mas de lo que empeoran</p>
        </div>
      </div>
    </div>
  )
}
