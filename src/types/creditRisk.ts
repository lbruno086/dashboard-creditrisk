export type SignalLevel = 'green' | 'amber' | 'red'

export type Product = 'tarjeta' | 'prestamo_personal' | 'hipotecario' | 'automotriz'
export type ScoreSegment = 'A' | 'B' | 'C' | 'D'
export type Period = '30d' | '3M' | '6M' | '12M' | 'YTD'

export interface KPI {
  id: string
  label: string
  value: string
  rawValue: number
  unit?: string
  variation: string
  variationDirection: 'up' | 'down' | 'flat'
  signal: SignalLevel
  accent: 'blue' | 'cyan' | 'violet' | 'amber' | 'green' | 'red'
  sparkline: number[]
  description?: string
}

export interface BucketDistribution {
  bucket: string
  pct: number
  amount: number
}

export interface VintageRow {
  cohort: string
  values: (number | null)[] // M3, M6, M9, M12, M18, M24
}

export interface RollRateRow {
  from: string
  to: Record<string, number>
}

export interface NetflowMonth {
  month: string
  entradas: number
  curas: number
  castigos: number
  netflow: number
  acumulado: number
}

export interface IsWasRow {
  segment: ScoreSegment
  is: number
  was: number
  ratio: number
  signal: SignalLevel
}

export interface FunnelStage {
  id: string
  label: string
  customers: number
  conversionRate?: number
  benchmark?: number
  signal: SignalLevel
  ingreso?: string
  note?: string
}

export interface RiskAppetiteIndicator {
  id: string
  name: string
  current: number
  unit: '%' | 'M' | 'ratio'
  limitMax?: number
  limitMin?: number
  signal: SignalLevel
  trend: number[]
  description: string
}

export interface ProductProfitability {
  product: string
  productKey: Product
  cartera: number
  nim: number
  spread: number
  costoRiesgo: number
  rentabilidadNeta: number
}

export interface ScoreSegmentRow {
  segment: ScoreSegment
  range: string
  pctCartera: number
  pctMora: number
  nim: number
  rentabilidadNeta: number
}

export interface AgeSegmentRow {
  range: string
  pctClientes: number
  pctMora: number
  ticketPromedio: number
}

export interface AlertItem {
  id: string
  severity: 'critico' | 'alerta' | 'info' | 'ok'
  title: string
  detail: string
  metric: string
  module: string
  timestamp: string
}

export interface FilterState {
  period: Period
  product: Product | 'todos'
  segment: ScoreSegment | 'todos'
}

export interface ModelDecileRow {
  decil: number
  scoreInf: number
  scoreSup: number
  casos: number
  frecuencia: number       // % sobre total
  pctMorosos: number       // % de morosos del decil sobre total morosos
  pctMorososAcum: number   // acumulado → llega a 100
  tasaMora: number         // tasa de morosidad del decil
  tasaMoraAcum: number     // tasa de morosidad acumulada (deciles 1..n)
  lift: number             // pctMorososAcum / frecuencia acumulada
}

export interface RocPoint {
  fpr: number   // false positive rate %
  tpr: number   // true positive rate %
}

export interface ModelInfo {
  id: string
  name: string
  tipo: string
  fecha: string
  auc: number
  gini: number
  ks: number
  ksDecil: number
  totalCasos: number
  totalMorosos: number
  tasaMoraGlobal: number
}
