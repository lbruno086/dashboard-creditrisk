export const fmtCurrency = (n: number, unit: 'M' | 'K' | '' = 'M'): string =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 1 })}${unit}`

export const fmtPct = (n: number, dec = 1): string => `${n.toFixed(dec)}%`

export const fmtNumber = (n: number): string => n.toLocaleString('en-US')

export const fmtCompact = (n: number): string =>
  Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

export const fmtRatio = (n: number, dec = 2): string => n.toFixed(dec)

export const fmtMillions = (n: number): string =>
  `$${Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)}M`
