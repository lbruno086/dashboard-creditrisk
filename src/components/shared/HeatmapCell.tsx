interface Props {
  value: number | null
  min?: number
  max?: number
  format?: (v: number) => string
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// Green (#10B981) → Amber (#F59E0B) → Red (#EF4444)
function heatmapColor(t: number): string {
  if (t < 0.5) {
    const u = t * 2
    return `rgb(${Math.round(lerp(16, 245, u))}, ${Math.round(lerp(185, 158, u))}, ${Math.round(lerp(129, 11, u))})`
  } else {
    const u = (t - 0.5) * 2
    return `rgb(${Math.round(lerp(245, 239, u))}, ${Math.round(lerp(158, 68, u))}, ${Math.round(lerp(11, 68, u))})`
  }
}

export default function HeatmapCell({ value, min = 0, max = 10, format }: Props) {
  if (value === null || value === undefined) {
    return (
      <td className="p-2 text-center">
        <span className="text-text-muted text-xs">—</span>
      </td>
    )
  }
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const color = heatmapColor(t)
  const label = format ? format(value) : `${value.toFixed(1)}%`

  return (
    <td className="p-1.5 text-center">
      <div
        className="rounded-md px-2 py-1 font-mono text-xs font-semibold text-white tabular-nums mx-auto w-fit"
        style={{ backgroundColor: color, minWidth: '48px' }}
      >
        {label}
      </div>
    </td>
  )
}
