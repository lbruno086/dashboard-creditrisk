import { useState } from 'react'
import clsx from 'clsx'
import AlertBadge from '@/components/shared/AlertBadge'
import ChartContainer from '@/components/shared/ChartContainer'
import PageHeader from '@/components/shared/PageHeader'
import { alerts } from '@/data/mockData'
import { filterLabel } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'
import type { AlertItem } from '@/types/creditRisk'

type SeverityFilter = 'todas' | AlertItem['severity']

export default function Alertas() {
  const { filters } = useFilters()
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('todas')

  const filtered = severityFilter === 'todas'
    ? alerts
    : alerts.filter(a => a.severity === severityFilter)

  const counts = {
    critico: alerts.filter(a => a.severity === 'critico').length,
    alerta: alerts.filter(a => a.severity === 'alerta').length,
    info: alerts.filter(a => a.severity === 'info').length,
    ok: alerts.filter(a => a.severity === 'ok').length,
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Alertas & Insights" subtitle={`Panel de señales automáticas de la cartera crediticia · ${filterLabel(filters)}`} />

      {/* Summary counters */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="card p-3 border-l-4 border-signal-red">
          <span className="text-signal-red text-[10px] font-bold uppercase tracking-wider">Crítico</span>
          <div className="font-mono text-2xl font-bold text-text-primary tabular-nums mt-0.5">{counts.critico}</div>
        </div>
        <div className="card p-3 border-l-4 border-signal-amber">
          <span className="text-signal-amber text-[10px] font-bold uppercase tracking-wider">Alerta</span>
          <div className="font-mono text-2xl font-bold text-text-primary tabular-nums mt-0.5">{counts.alerta}</div>
        </div>
        <div className="card p-3 border-l-4 border-accent-blue">
          <span className="text-accent-blue text-[10px] font-bold uppercase tracking-wider">Info</span>
          <div className="font-mono text-2xl font-bold text-text-primary tabular-nums mt-0.5">{counts.info}</div>
        </div>
        <div className="card p-3 border-l-4 border-signal-green">
          <span className="text-signal-green text-[10px] font-bold uppercase tracking-wider">OK</span>
          <div className="font-mono text-2xl font-bold text-text-primary tabular-nums mt-0.5">{counts.ok}</div>
        </div>
      </div>

      <ChartContainer
        title="Timeline de Alertas"
        subtitle={severityFilter === 'todas' ? 'Todas las señales' : `Filtrando por: ${severityFilter}`}
        headerRight={
          <div className="flex items-center gap-1">
            {(['todas', 'critico', 'alerta', 'info', 'ok'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={clsx(
                  'px-2 py-1 rounded-md text-[10px] font-medium transition-colors',
                  severityFilter === s
                    ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                    : 'text-text-muted hover:text-text-primary border border-transparent'
                )}
              >
                {s === 'todas' ? 'Todas' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        }
        minHeight={0}
      >
        <div className="flex flex-col gap-2">
          {filtered.map(a => (
            <AlertBadge key={a.id} alert={a} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-text-muted text-sm text-center py-4">No hay alertas con este filtro.</p>
        )}
      </ChartContainer>
    </div>
  )
}
