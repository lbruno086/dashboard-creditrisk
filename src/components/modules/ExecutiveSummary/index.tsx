import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import KPICard from '@/components/shared/KPICard'
import ChartContainer from '@/components/shared/ChartContainer'
import AlertBadge from '@/components/shared/AlertBadge'
import PageHeader from '@/components/shared/PageHeader'
import {
  kpis, moraBucketsTimeline, profitabilityByProduct, alerts,
} from '@/data/mockData'
import { byPeriod, filterLabel, riskAdjusted } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'

const PRODUCT_COLORS = ['#D71920', '#C6A15B', '#8F969E', '#F59E0B']

const topAlerts = alerts.filter(a => a.severity === 'critico' || a.severity === 'alerta').slice(0, 5)

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-elevated/90 backdrop-blur border border-border-subtle rounded-lg shadow-lg p-3 text-xs">
      <p className="text-text-secondary font-medium mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-text-secondary">{p.name}:</span>
          <span className="text-text-primary font-mono font-semibold">{p.value.toFixed(2)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function ExecutiveSummary() {
  const { filters } = useFilters()
  const visibleProducts = filters.product === 'todos'
    ? profitabilityByProduct
    : profitabilityByProduct.filter(p => p.productKey === filters.product)
  const moraAreaData = byPeriod(moraBucketsTimeline, filters).map(d => ({
    mes: d.mes,
    mora30: riskAdjusted(d.b31_60 + d.b61_90 + d.b91_180 + d.b180_plus, filters),
    npl90: riskAdjusted(d.b91_180 + d.b180_plus, filters),
  }))

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Resumen Ejecutivo"
        subtitle={`Vista general de la cartera de individuos · ICBC Argentina · Mayo 2026 · ${filterLabel(filters)}`}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpis.map(kpi => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Evolución mora 12M */}
        <ChartContainer
          title="Evolución de Mora · 12 meses"
          subtitle="Mora 30+ días y NPL 90+ días como % de cartera"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={moraAreaData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gradMora30" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D71920" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D71920" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradNPL90" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C6A15B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C6A15B" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="mora30" name="Mora 30+" stroke="#D71920" strokeWidth={2} fill="url(#gradMora30)" />
              <Area type="monotone" dataKey="npl90" name="NPL 90+" stroke="#C6A15B" strokeWidth={2} fill="url(#gradNPL90)" />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#94A3B8', paddingTop: '8px' }}
                iconType="circle"
                iconSize={8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Distribución por producto */}
        <ChartContainer
          title="Composición de Cartera"
          subtitle="Distribución por producto ($M)"
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <defs>
                {PRODUCT_COLORS.map((c, i) => (
                  <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={c} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={visibleProducts}
                dataKey="cartera"
                nameKey="product"
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={82}
                paddingAngle={3}
                strokeWidth={0}
              >
                {visibleProducts.map((_, index) => (
                  <Cell key={index} fill={`url(#pieGrad${index})`} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value}M`, '']}
                contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '10px', color: '#94A3B8' }}
                iconType="circle"
                iconSize={7}
                formatter={(value: string) => value.replace('Préstamo personal', 'Préstamo P.').replace('Tarjeta de crédito', 'Tarjeta')}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Top alertas */}
        <ChartContainer
          title="Alertas del período"
          subtitle="Críticas y de atención"
          className="lg:col-span-3"
          minHeight={0}
        >
          <div className="flex flex-col gap-2">
            {topAlerts.map(a => (
              <AlertBadge key={a.id} alert={a} compact />
            ))}
          </div>
        </ChartContainer>
      </div>
    </div>
  )
}
