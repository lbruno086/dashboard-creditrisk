import type { SignalLevel } from '@/types/creditRisk'

export function signalFor(
  value: number,
  opts: { limitMax?: number; limitMin?: number; amberPad?: number }
): SignalLevel {
  const pad = opts.amberPad ?? 0.1
  if (opts.limitMax !== undefined) {
    if (value > opts.limitMax) return 'red'
    if (value > opts.limitMax * (1 - pad)) return 'amber'
    return 'green'
  }
  if (opts.limitMin !== undefined) {
    if (value < opts.limitMin) return 'red'
    if (value < opts.limitMin * (1 + pad)) return 'amber'
    return 'green'
  }
  return 'green'
}

export const SIGNAL_COLORS: Record<SignalLevel, string> = {
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
}

export const SIGNAL_BG: Record<SignalLevel, string> = {
  green: 'rgba(16, 185, 129, 0.1)',
  amber: 'rgba(245, 158, 11, 0.1)',
  red: 'rgba(239, 68, 68, 0.1)',
}

export const SIGNAL_BG_CLASS: Record<SignalLevel, string> = {
  green: 'bg-signal-green/10',
  amber: 'bg-signal-amber/10',
  red: 'bg-signal-red/10',
}

export const SIGNAL_BORDER: Record<SignalLevel, string> = {
  green: 'border-signal-green/30',
  amber: 'border-signal-amber/30',
  red: 'border-signal-red/30',
}

export const SIGNAL_TEXT: Record<SignalLevel, string> = {
  green: 'text-signal-green',
  amber: 'text-signal-amber',
  red: 'text-signal-red',
}
