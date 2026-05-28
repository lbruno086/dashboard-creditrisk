import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import FunnelStage from '@/components/shared/FunnelStage'
import ChartContainer from '@/components/shared/ChartContainer'
import PageHeader from '@/components/shared/PageHeader'
import { funnelStages, funnelKpisExtra, funnelConversionTimeline } from '@/data/mockData'
import { byPeriod, filterLabel, periodScale, riskAdjusted, volumeAdjusted } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'

const stageMetricMap = {
  aprobados: 'aprobacion',
  activados: 'activacion',
  uso: 'usoActivo',
  cross: 'cross',
  recupero: 'recupero',
} as const

export default function CicloVida() {
  const { filters } = useFilters()
  const timeline = byPeriod(funnelConversionTimeline, filters).map(row => ({
    ...row,
    aprobacion: riskAdjusted(row.aprobacion, filters),
    activacion: riskAdjusted(row.activacion, filters),
    usoActivo: riskAdjusted(row.usoActivo, filters),
    cross: riskAdjusted(row.cross, filters),
    recupero: riskAdjusted(row.recupero, filters),
  }))
  const latestVisible = timeline[timeline.length - 1]
  const scale = periodScale(filters)
  const stages = funnelStages.map(stage => {
    const metric = stageMetricMap[stage.id as keyof typeof stageMetricMap]
    const visibleRate = metric ? latestVisible?.[metric] : stage.conversionRate

    return {
      ...stage,
      customers: Math.max(1, Math.round(volumeAdjusted(stage.customers, filters) * scale)),
      conversionRate: visibleRate ? Math.min(100, visibleRate) : undefined,
    }
  })

  return (
    <div className="animate-fade-in">
      <PageHeader title="Ciclo de Vida del Cliente" subtitle={`Funnel completo: originación → activación → uso → cross-sell → recupero · ${filterLabel(filters)}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel */}
        <ChartContainer title="Funnel de Conversión" subtitle={`Clientes por etapa - ${filters.period}`} className="lg:col-span-2" minHeight={0}>
          <div className="flex flex-col gap-2">
            {stages.map((stage, i) => (
              <div key={stage.id}>
                <FunnelStage
                  label={stage.label}
                  customers={stage.customers}
                  conversionRate={stage.conversionRate}
                  benchmark={stage.benchmark}
                  signal={stage.signal}
                  ingreso={stage.ingreso}
                  note={stage.note}
                />
                {i < stages.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" className="text-text-muted">
                      <path d="M6 9L2 4h8z" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* KPIs complementarios */}
        <ChartContainer title="Métricas Complementarias" subtitle="Indicadores clave por etapa" minHeight={0}>
          <div className="space-y-4">
            <div className="card-hover p-3 rounded-lg bg-bg-elevated/30 border border-border-subtle">
              <span className="text-text-secondary text-xs">Tiempo Prom. Aprobación</span>
              <div className="font-mono text-lg font-semibold text-text-primary mt-0.5">{funnelKpisExtra.tiempoAprobacion}</div>
            </div>
            <div className="card-hover p-3 rounded-lg bg-bg-elevated/30 border border-border-subtle">
              <span className="text-text-secondary text-xs">Churn Rate 90d post-activación</span>
              <div className="font-mono text-lg font-semibold text-signal-red mt-0.5">{funnelKpisExtra.churn90d}</div>
            </div>
            <div className="card-hover p-3 rounded-lg bg-bg-elevated/30 border border-border-subtle">
              <span className="text-text-secondary text-xs">Contactabilidad en Gestión</span>
              <div className="font-mono text-lg font-semibold text-signal-amber mt-0.5">{funnelKpisExtra.contactabilidad}</div>
            </div>
            <div className="card-hover p-3 rounded-lg bg-bg-elevated/30 border border-border-subtle">
              <span className="text-text-secondary text-xs">LTV Prom. Cliente Activo</span>
              <div className="font-mono text-lg font-semibold text-accent-cyan mt-0.5">{funnelKpisExtra.ltvPromedio}</div>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Evolución tasas de conversión */}
      <div className="mt-4">
        <ChartContainer title="Evolución Tasas de Conversión" subtitle={filterLabel(filters)}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timeline} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[20, 85]} />
              <Tooltip
                contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
                formatter={(v: number) => [`${v.toFixed(1)}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: '#94A3B8', paddingTop: '8px' }} iconType="circle" iconSize={7} />
              <Line type="monotone" dataKey="aprobacion" name="Aprobación" stroke="#D71920" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="activacion" name="Activación" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="usoActivo" name="Uso Activo" stroke="#C6A15B" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="cross" name="Cross-sell" stroke="#8F969E" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="recupero" name="Recupero" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
