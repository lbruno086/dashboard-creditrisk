import { useState } from 'react'
import clsx from 'clsx'
import MoraBuckets from './MoraBuckets'
import Vintage from './Vintage'
import RollRates from './RollRates'
import Netflow from './Netflow'
import IsWas from './IsWas'
import PageHeader from '@/components/shared/PageHeader'
import { filterLabel } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'

const TABS = [
  { id: 'mora', label: 'Mora por Bucket' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'rollrates', label: 'Roll Rates' },
  { id: 'netflow', label: 'Netflow' },
  { id: 'iswas', label: 'IS-WAS' },
] as const

type TabId = typeof TABS[number]['id']

export default function CalidadCartera() {
  const { filters } = useFilters()
  const [activeTab, setActiveTab] = useState<TabId>('mora')

  return (
    <div className="animate-fade-in">
      <PageHeader title="Calidad de Cartera" subtitle={`Análisis de morosidad, cosechas, transiciones y flujos · ${filterLabel(filters)}`} />

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-bg-card rounded-xl border border-border-subtle p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
              activeTab === tab.id
                ? 'bg-accent-blue text-white shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'mora' && <MoraBuckets />}
      {activeTab === 'vintage' && <Vintage />}
      {activeTab === 'rollrates' && <RollRates />}
      {activeTab === 'netflow' && <Netflow />}
      {activeTab === 'iswas' && <IsWas />}
    </div>
  )
}
