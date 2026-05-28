import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import ChartContainer from '@/components/shared/ChartContainer'
import PageHeader from '@/components/shared/PageHeader'
import { profitabilityByProduct, profitabilityTotal, profitabilityKpis, roaNimTimeline } from '@/data/mockData'
import { byPeriod, filterLabel } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'

const PRODUCT_COLORS = ['#D71920', '#C6A15B', '#8F969E', '#F59E0B']

const groupBarData = profitabilityByProduct.map(p => ({
  product: p.product.replace('Tarjeta de crédito', 'Tarjeta').replace('Préstamo personal', 'Préstamo P.'),
  NIM: p.nim,
  costRiesgo: p.costoRiesgo,
  rentabilidad: p.rentabilidadNeta,
}))

export default function Rentabilidad() {
  const { filters } = useFilters()
  const products = filters.product === 'todos'
    ? profitabilityByProduct
    : profitabilityByProduct.filter(p => p.productKey === filters.product)
  const total = products.length === profitabilityByProduct.length
    ? profitabilityTotal
    : products.reduce((acc, p) => ({
      cartera: acc.cartera + p.cartera,
      nim: p.nim,
      spread: p.spread,
      costoRiesgo: p.costoRiesgo,
      rentabilidadNeta: p.rentabilidadNeta,
    }), { cartera: 0, nim: 0, spread: 0, costoRiesgo: 0, rentabilidadNeta: 0 })
  const visibleGroupBarData = filters.product === 'todos' ? groupBarData : products.map(p => ({
    product: p.product.replace('Tarjeta de crédito', 'Tarjeta').replace('Préstamo personal', 'Préstamo P.'),
    NIM: p.nim,
    costRiesgo: p.costoRiesgo,
    rentabilidad: p.rentabilidadNeta,
  }))
  const timeline = byPeriod(roaNimTimeline, filters)

  return (
    <div className="animate-fade-in">
      <PageHeader title="Rentabilidad de Cartera" subtitle={`NIM, spread, costo de riesgo y rentabilidad por producto · ${filterLabel(filters)}`} />

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="card p-4 border-l-4 border-accent-blue">
          <span className="text-text-muted text-xs font-medium">ROA</span>
          <div className="font-mono text-xl font-semibold text-text-primary tabular-nums mt-0.5">{profitabilityKpis.roa}%</div>
        </div>
        <div className="card p-4 border-l-4 border-accent-violet">
          <span className="text-text-muted text-xs font-medium">ROE</span>
          <div className="font-mono text-xl font-semibold text-text-primary tabular-nums mt-0.5">{profitabilityKpis.roe}%</div>
        </div>
        <div className="card p-4 border-l-4 border-accent-cyan">
          <span className="text-text-muted text-xs font-medium">Eficiencia</span>
          <div className="font-mono text-xl font-semibold text-signal-green tabular-nums mt-0.5">{profitabilityKpis.eficiencia}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Grouped bar chart */}
        <ChartContainer title="NIM vs Costo de Riesgo vs Rentabilidad" subtitle="% por producto">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={visibleGroupBarData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="product" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
                formatter={(v: number) => [`${v.toFixed(1)}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: '#94A3B8', paddingTop: '8px' }} iconType="square" iconSize={8} />
              <Bar dataKey="NIM" name="NIM" fill="#D71920" radius={[3, 3, 0, 0]} />
              <Bar dataKey="costRiesgo" name="Costo Riesgo" fill="#EF4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="rentabilidad" name="Rent. Neta" fill="#10B981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Treemap-like (simplified as colored squares) */}
        <ChartContainer title="Cartera por Producto" subtitle="Tamaño = cartera, color = rentabilidad" minHeight={0}>
          <div className="grid grid-cols-2 gap-3 h-full">
            {products.map(p => {
              const pct = p.cartera / total.cartera
              return (
                <div
                  key={p.productKey}
                  className="relative rounded-xl overflow-hidden flex items-end p-3 transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${PRODUCT_COLORS[profitabilityByProduct.indexOf(p)]}30, ${PRODUCT_COLORS[profitabilityByProduct.indexOf(p)]}10)`,
                    border: `1px solid ${PRODUCT_COLORS[profitabilityByProduct.indexOf(p)]}40`,
                    gridRow: `span ${Math.ceil(pct * 4)}`,
                  }}
                >
                  <div className="relative z-10">
                    <div className="text-text-primary text-sm font-semibold">{p.product.replace('Tarjeta de crédito', 'Tarjeta').replace('Préstamo personal', 'Préstamo P.')}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-text-secondary text-xs font-mono">${p.cartera}M</span>
                      <span className="text-accent-cyan text-xs font-mono font-semibold">{(pct * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="chip bg-bg-card/50 border border-border-subtle/50 text-signal-green text-[10px]">
                        Rent. {p.rentabilidadNeta}%
                      </span>
                      <span className="chip bg-bg-card/50 border border-border-subtle/50 text-text-muted text-[10px]">
                        NIM {p.nim}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartContainer>
      </div>

      {/* Main table */}
      <ChartContainer title="Detalle de Rentabilidad por Producto" subtitle="Cartera, márgenes y rentabilidad neta" className="mb-4" minHeight={0}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle/50">
                <th className="text-left text-text-muted font-medium py-2 text-[11px]">Producto</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Cartera</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">NIM</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Spread</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Costo Riesgo</th>
                <th className="text-right text-text-muted font-medium py-2 text-[11px]">Rent. Neta</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.productKey} className="border-b border-border-subtle/20 hover:bg-bg-elevated/20 transition-colors">
                  <td className="py-2 text-text-primary font-medium">{p.product}</td>
                  <td className="py-2 text-text-primary font-mono text-right">${p.cartera}M</td>
                  <td className={`py-2 font-mono text-right ${p.nim > 15 ? 'text-signal-green' : 'text-text-primary'}`}>{p.nim.toFixed(1)}%</td>
                  <td className="py-2 text-text-primary font-mono text-right">{p.spread.toFixed(1)}%</td>
                  <td className={`py-2 font-mono text-right ${p.costoRiesgo > 3 ? 'text-signal-amber' : 'text-text-primary'}`}>{p.costoRiesgo.toFixed(1)}%</td>
                  <td className={`py-2 font-mono font-semibold text-right ${p.rentabilidadNeta > 10 ? 'text-signal-green' : p.rentabilidadNeta > 5 ? 'text-signal-amber' : 'text-text-primary'}`}>
                    {p.rentabilidadNeta.toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-border-subtle bg-bg-elevated/20">
                <td className="py-2 text-text-primary font-bold">Total</td>
                <td className="py-2 text-text-primary font-mono font-bold text-right">${total.cartera}M</td>
                <td className="py-2 font-mono font-bold text-right text-signal-green">{total.nim.toFixed(1)}%</td>
                <td className="py-2 text-text-primary font-mono font-bold text-right">{total.spread.toFixed(1)}%</td>
                <td className="py-2 font-mono font-bold text-right text-signal-amber">{total.costoRiesgo.toFixed(1)}%</td>
                <td className="py-2 font-mono font-bold text-right text-signal-green">{total.rentabilidadNeta.toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ChartContainer>

      {/* ROA/NIM timeline */}
      <ChartContainer title="Evolución ROA y NIM" subtitle="12 meses">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={timeline} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRoa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D71920" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D71920" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradNim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C6A15B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C6A15B" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
              formatter={(v: number) => [`${v.toFixed(1)}%`]}
            />
            <Legend wrapperStyle={{ fontSize: '10px', color: '#94A3B8', paddingTop: '8px' }} iconType="circle" iconSize={8} />
            <Area type="monotone" dataKey="roa" name="ROA" stroke="#D71920" strokeWidth={2} fill="url(#gradRoa)" />
            <Area type="monotone" dataKey="nim" name="NIM" stroke="#C6A15B" strokeWidth={2} fill="url(#gradNim)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
