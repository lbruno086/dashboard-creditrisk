import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import clsx from 'clsx'
import type { AlertItem } from '@/types/creditRisk'

const CONFIG = {
  critico: { Icon: AlertCircle, color: 'text-signal-red', bg: 'bg-signal-red/10', border: 'border-signal-red/30', label: 'Crítico' },
  alerta: { Icon: AlertTriangle, color: 'text-signal-amber', bg: 'bg-signal-amber/10', border: 'border-signal-amber/30', label: 'Alerta' },
  info: { Icon: Info, color: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/30', label: 'Info' },
  ok: { Icon: CheckCircle, color: 'text-signal-green', bg: 'bg-signal-green/10', border: 'border-signal-green/30', label: 'OK' },
} as const

interface Props {
  alert: AlertItem
  compact?: boolean
}

export default function AlertBadge({ alert, compact = false }: Props) {
  const cfg = CONFIG[alert.severity]
  const { Icon } = cfg

  if (compact) {
    return (
      <div className={clsx('flex items-start gap-2.5 p-2.5 rounded-lg border', cfg.bg, cfg.border)}>
        <Icon size={14} className={clsx(cfg.color, 'flex-shrink-0 mt-0.5')} />
        <div className="min-w-0">
          <p className="text-text-primary text-xs font-medium leading-tight truncate">{alert.title}</p>
          <p className="text-text-muted text-[10px] mt-0.5">{alert.timestamp} · {alert.module}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('flex items-start gap-3 p-3.5 rounded-xl border border-l-4', cfg.bg, cfg.border)}>
      <Icon size={16} className={clsx(cfg.color, 'flex-shrink-0 mt-0.5')} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx('text-[10px] font-bold uppercase tracking-wide', cfg.color)}>{cfg.label}</span>
          <span className="text-text-muted text-[10px]">{alert.timestamp}</span>
          <span className="text-text-muted text-[10px]">· {alert.module}</span>
        </div>
        <p className="text-text-primary text-sm font-medium mt-0.5 leading-tight">{alert.title}</p>
        <p className="text-text-secondary text-xs mt-1 leading-relaxed">{alert.detail}</p>
      </div>
    </div>
  )
}
