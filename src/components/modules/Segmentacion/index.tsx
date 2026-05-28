import { useState } from 'react'
import clsx from 'clsx'
import ScoreTab from './ScoreTab'
import EdadTab from './EdadTab'
import PageHeader from '@/components/shared/PageHeader'
import { filterLabel } from '@/lib/filtering'
import { useFilters } from '@/hooks/useFilters'

const TABS = [
  { id: 'score', label: 'Score Crediticio' },
  { id: 'edad', label: 'Demografía' },
] as const

export default function Segmentacion() {
  const { filters } = useFilters()
  const [activeTab, setActiveTab] = useState<'score' | 'edad'>('score')

  return (
    <div className="animate-fade-in">
      <PageHeader title="Segmentación de Cartera" subtitle={`Análisis por score crediticio y perfil demográfico · ${filterLabel(filters)}`} />

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

      {activeTab === 'score' && <ScoreTab />}
      {activeTab === 'edad' && <EdadTab />}
    </div>
  )
}
