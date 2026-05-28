import { SIGNAL_COLORS, SIGNAL_TEXT } from '@/lib/signals'
import type { SignalLevel } from '@/types/creditRisk'

interface Props {
  current: number
  max?: number
  min?: number
  label: string
  signal: SignalLevel
  unit: string
}

export default function SemaforoGauge({ current, max, min, signal, unit }: Props) {
  const limit = max ?? min ?? 0
  const pct = Math.min(100, (current / (limit * 1.5)) * 100)
  const color = SIGNAL_COLORS[signal]

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative w-20 h-10 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full border-4 border-bg-elevated" style={{ clipPath: 'polygon(0 100%, 0 0, 100% 0, 100% 100%)' }} />
        <div
          className="absolute inset-0 rounded-t-full border-4 border-transparent"
          style={{
            borderColor: color,
            clipPath: `polygon(0 100%, 0 ${100 - pct}%, ${pct}% 0, 100% ${100 - pct}%, 100% 100%)`,
          }}
        />
      </div>
      <span className={`font-mono text-base font-bold tabular-nums ${SIGNAL_TEXT[signal]}`}>
        {current.toFixed(1)}{unit}
      </span>
      <span className="text-text-muted text-[10px] leading-tight text-center">
        {max ? `límite ${max}${unit}` : min ? `mín ${min}${unit}` : ''}
      </span>
    </div>
  )
}
