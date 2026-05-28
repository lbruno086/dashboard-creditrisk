import type {
  KPI,
  BucketDistribution,
  VintageRow,
  RollRateRow,
  NetflowMonth,
  IsWasRow,
  FunnelStage,
  RiskAppetiteIndicator,
  ProductProfitability,
  ScoreSegmentRow,
  AgeSegmentRow,
  AlertItem,
} from '@/types/creditRisk'

// â”€â”€â”€ 6.1 Executive Summary KPIs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const kpis: KPI[] = [
  {
    id: 'cartera_total',
    label: 'Cartera Total',
    value: '$4,850M',
    rawValue: 4850,
    variation: '+3.2% MoM',
    variationDirection: 'up',
    signal: 'green',
    accent: 'blue',
    sparkline: [4620, 4655, 4690, 4720, 4760, 4790, 4810, 4830, 4845, 4848, 4849, 4850],
  },
  {
    id: 'mora_30',
    label: 'Mora 30+ dias',
    value: '3.8%',
    rawValue: 3.8,
    variation: '+0.2pp',
    variationDirection: 'up',
    signal: 'amber',
    accent: 'amber',
    sparkline: [3.4, 3.5, 3.6, 3.5, 3.6, 3.6, 3.7, 3.6, 3.7, 3.7, 3.8, 3.8],
  },
  {
    id: 'npl_90',
    label: 'NPL 90+ dias',
    value: '1.9%',
    rawValue: 1.9,
    variation: '-0.1pp',
    variationDirection: 'down',
    signal: 'green',
    accent: 'green',
    sparkline: [2.1, 2.1, 2.0, 2.0, 2.0, 2.1, 2.0, 2.0, 1.9, 1.9, 2.0, 1.9],
  },
  {
    id: 'clientes_act',
    label: 'Clientes Activos',
    value: '182.4K',
    rawValue: 182400,
    variation: '+1.1%',
    variationDirection: 'up',
    signal: 'green',
    accent: 'cyan',
    sparkline: [175800, 176900, 178100, 179200, 179800, 180300, 180900, 181400, 181800, 182000, 182200, 182400],
  },
  {
    id: 'aprobacion',
    label: 'Tasa Aprobacion',
    value: '62.4%',
    rawValue: 62.4,
    variation: '-1.8pp',
    variationDirection: 'down',
    signal: 'amber',
    accent: 'blue',
    sparkline: [65.2, 64.8, 64.5, 64.1, 63.8, 63.5, 63.2, 62.9, 62.7, 62.5, 62.4, 62.4],
  },
  {
    id: 'roe',
    label: 'ROE',
    value: '18.2%',
    rawValue: 18.2,
    variation: '+0.5pp',
    variationDirection: 'up',
    signal: 'green',
    accent: 'violet',
    sparkline: [17.1, 17.2, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 18.0, 18.1, 18.1, 18.2],
    description: 'Return on Equity. Rentabilidad neta sobre cartera = 12.2%',
  },
]

// â”€â”€â”€ 6.2 Buckets de mora â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const moraBuckets: BucketDistribution[] = [
  { bucket: 'Al dia', pct: 92.5, amount: 4486.25 },
  { bucket: '1-30 dias', pct: 3.7, amount: 179.45 },
  { bucket: '31-60 dias', pct: 1.1, amount: 53.35 },
  { bucket: '61-90 dias', pct: 0.8, amount: 38.8 },
  { bucket: '91-180 dias', pct: 1.1, amount: 53.35 },
  { bucket: '180+ dias', pct: 0.8, amount: 38.8 },
]

// â”€â”€â”€ 6.3 Mora timeline 12 meses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const moraBucketsTimeline = [
  { mes: 'Jun-25', al_dia: 93.1, b1_30: 3.5, b31_60: 1.0, b61_90: 0.7, b91_180: 1.0, b180_plus: 0.7 },
  { mes: 'Jul-25', al_dia: 92.9, b1_30: 3.6, b31_60: 1.0, b61_90: 0.7, b91_180: 1.1, b180_plus: 0.7 },
  { mes: 'Ago-25', al_dia: 92.8, b1_30: 3.6, b31_60: 1.0, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.7 },
  { mes: 'Sep-25', al_dia: 92.7, b1_30: 3.6, b31_60: 1.1, b61_90: 0.7, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Oct-25', al_dia: 92.7, b1_30: 3.6, b31_60: 1.0, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Nov-25', al_dia: 92.6, b1_30: 3.7, b31_60: 1.0, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Dic-25', al_dia: 92.6, b1_30: 3.6, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Ene-26', al_dia: 92.7, b1_30: 3.6, b31_60: 1.1, b61_90: 0.7, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Feb-26', al_dia: 92.6, b1_30: 3.6, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Mar-26', al_dia: 92.6, b1_30: 3.6, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Abr-26', al_dia: 92.5, b1_30: 3.7, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'May-26', al_dia: 92.5, b1_30: 3.7, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
]

// â”€â”€â”€ 6.4 Vintage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const vintageData: VintageRow[] = [
  { cohort: 'Ene-2024', values: [0.4, 1.1, 2.3, 3.8, 5.1, 6.2] },
  { cohort: 'Feb-2024', values: [0.3, 1.0, 2.1, 3.5, 4.9, null] },
  { cohort: 'Mar-2024', values: [0.5, 1.3, 2.5, 4.0, null, null] },
  { cohort: 'Abr-2024', values: [0.4, 1.2, 2.4, null, null, null] },
  { cohort: 'May-2024', values: [0.5, 1.4, null, null, null, null] },
  { cohort: 'Jun-2024', values: [0.3, null, null, null, null, null] },
]
export const vintageColumns = ['M3', 'M6', 'M9', 'M12', 'M18', 'M24']
export const vintageBenchmark = [0.4, 1.2, 2.3, 3.6, 4.8, 5.9]

// â”€â”€â”€ 6.5 Roll Rates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const rollRateBuckets = ['Al dia', '1-30d', '31-60d', '61-90d', '90+d', 'Castigo', 'Cancelado']
export const rollRateMatrix: RollRateRow[] = [
  { from: 'Al dia', to: { 'Al dia': 93.2, '1-30d': 5.1, '31-60d': 0.9, '61-90d': 0.4, '90+d': 0.2, 'Castigo': 0.1, 'Cancelado': 0.1 } },
  { from: '1-30d', to: { 'Al dia': 68.4, '1-30d': 18.2, '31-60d': 9.3, '61-90d': 2.8, '90+d': 0.9, 'Castigo': 0.2, 'Cancelado': 0.2 } },
  { from: '31-60d', to: { 'Al dia': 24.1, '1-30d': 21.3, '31-60d': 28.4, '61-90d': 18.9, '90+d': 5.8, 'Castigo': 1.2, 'Cancelado': 0.3 } },
  { from: '61-90d', to: { 'Al dia': 8.2, '1-30d': 9.4, '31-60d': 18.2, '61-90d': 28.6, '90+d': 31.2, 'Castigo': 4.0, 'Cancelado': 0.4 } },
  { from: '90+d', to: { 'Al dia': 2.1, '1-30d': 3.3, '31-60d': 5.8, '61-90d': 12.4, '90+d': 58.9, 'Castigo': 16.8, 'Cancelado': 0.7 } },
]

// â”€â”€â”€ 6.6 Netflow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const netflowData: NetflowMonth[] = [
  { month: 'Jun-25', entradas: 11.6, curas: 8.9, castigos: 2.1, netflow: 0.6, acumulado: 0.6 },
  { month: 'Jul-25', entradas: 12.1, curas: 9.1, castigos: 2.2, netflow: 0.8, acumulado: 1.4 },
  { month: 'Ago-25', entradas: 11.4, curas: 9.6, castigos: 2.0, netflow: -0.2, acumulado: 1.2 },
  { month: 'Sep-25', entradas: 12.5, curas: 8.7, castigos: 2.3, netflow: 1.5, acumulado: 2.7 },
  { month: 'Oct-25', entradas: 11.9, curas: 9.5, castigos: 2.2, netflow: 0.2, acumulado: 2.9 },
  { month: 'Nov-25', entradas: 12.3, curas: 9.0, castigos: 2.4, netflow: 0.9, acumulado: 3.8 },
  { month: 'Dic-25', entradas: 12.8, curas: 8.6, castigos: 2.3, netflow: 1.9, acumulado: 5.7 },
  { month: 'Ene-26', entradas: 12.4, curas: 8.1, castigos: 2.2, netflow: 2.1, acumulado: 7.8 },
  { month: 'Feb-26', entradas: 11.8, curas: 9.3, castigos: 2.0, netflow: 0.5, acumulado: 8.3 },
  { month: 'Mar-26', entradas: 13.2, curas: 7.9, castigos: 2.4, netflow: 2.9, acumulado: 11.2 },
  { month: 'Abr-26', entradas: 10.5, curas: 10.1, castigos: 2.1, netflow: -1.7, acumulado: 9.5 },
  { month: 'May-26', entradas: 11.2, curas: 9.8, castigos: 2.0, netflow: -0.6, acumulado: 8.9 },
]

// â”€â”€â”€ 6.7 IS-WAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const isWasData: IsWasRow[] = [
  { segment: 'A', is: 0.8, was: 1.0, ratio: 0.8, signal: 'green' },
  { segment: 'B', is: 2.4, was: 2.2, ratio: 1.09, signal: 'amber' },
  { segment: 'C', is: 5.8, was: 5.0, ratio: 1.16, signal: 'amber' },
  { segment: 'D', is: 12.3, was: 11.0, ratio: 1.12, signal: 'amber' },
]

export const isWasTimeline = [
  { mes: 'Jun-25', A: 0.78, B: 1.04, C: 1.08, D: 1.05 },
  { mes: 'Jul-25', A: 0.79, B: 1.05, C: 1.09, D: 1.06 },
  { mes: 'Ago-25', A: 0.78, B: 1.06, C: 1.1, D: 1.07 },
  { mes: 'Sep-25', A: 0.79, B: 1.06, C: 1.11, D: 1.08 },
  { mes: 'Oct-25', A: 0.8, B: 1.07, C: 1.12, D: 1.09 },
  { mes: 'Nov-25', A: 0.8, B: 1.07, C: 1.13, D: 1.09 },
  { mes: 'Dic-25', A: 0.8, B: 1.08, C: 1.13, D: 1.1 },
  { mes: 'Ene-26', A: 0.8, B: 1.08, C: 1.14, D: 1.1 },
  { mes: 'Feb-26', A: 0.8, B: 1.08, C: 1.14, D: 1.11 },
  { mes: 'Mar-26', A: 0.8, B: 1.09, C: 1.15, D: 1.11 },
  { mes: 'Abr-26', A: 0.8, B: 1.09, C: 1.16, D: 1.12 },
  { mes: 'May-26', A: 0.8, B: 1.09, C: 1.16, D: 1.12 },
]

// â”€â”€â”€ 6.8 Ciclo de Vida â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const funnelStages: FunnelStage[] = [
  { id: 'leads', label: 'Leads / Solicitudes', customers: 48200, signal: 'green' },
  { id: 'aprobados', label: 'Aprobados', customers: 30060, conversionRate: 62.4, benchmark: 65.0, signal: 'amber' },
  { id: 'activados', label: 'Activados 30d', customers: 22845, conversionRate: 76.0, benchmark: 72.0, signal: 'green' },
  { id: 'uso', label: 'Uso Activo 90d', customers: 18276, conversionRate: 80.0, benchmark: 75.0, signal: 'green', ingreso: '$8.4M/mes' },
  { id: 'cross', label: 'Cross-sell', customers: 5483, conversionRate: 30.0, signal: 'green', ingreso: '+$2.1M/mes' },
  { id: 'upsell', label: 'Up-sell', customers: 2741, conversionRate: 15.0, signal: 'green', ingreso: '+$1.2M/mes' },
  { id: 'mora', label: 'En Gestion Mora', customers: 1827, signal: 'amber', note: 'mora activa cohorte' },
  { id: 'recupero', label: 'Recuperados', customers: 912, conversionRate: 49.9, signal: 'green', ingreso: '+$0.8M recupero' },
]

export const funnelKpisExtra = {
  tiempoAprobacion: '2.3 dias',
  churn90d: '12.4%',
  contactabilidad: '58%',
  ltvPromedio: '$284,000',
}

export const funnelConversionTimeline = [
  { mes: 'Dic-25', aprobacion: 64.1, activacion: 73.2, usoActivo: 78.1, cross: 28.4, recupero: 47.2 },
  { mes: 'Ene-26', aprobacion: 63.8, activacion: 74.0, usoActivo: 78.6, cross: 28.9, recupero: 47.8 },
  { mes: 'Feb-26', aprobacion: 63.5, activacion: 74.6, usoActivo: 79.0, cross: 29.2, recupero: 48.3 },
  { mes: 'Mar-26', aprobacion: 63.1, activacion: 75.1, usoActivo: 79.4, cross: 29.5, recupero: 48.9 },
  { mes: 'Abr-26', aprobacion: 62.7, activacion: 75.6, usoActivo: 79.7, cross: 29.8, recupero: 49.4 },
  { mes: 'May-26', aprobacion: 62.4, activacion: 76.0, usoActivo: 80.0, cross: 30.0, recupero: 49.9 },
]

// â”€â”€â”€ 6.9 Límites de Riesgo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const riskAppetite: RiskAppetiteIndicator[] = [
  { id: 'npl90', name: 'NPL 90+ dias', current: 1.9, unit: '%', limitMax: 2.5, signal: 'green', trend: [2.1, 2.1, 2.0, 2.0, 2.0, 1.9], description: 'Prestames en default â‰¥ 90 dias sobre cartera total' },
  { id: 'mora30', name: 'Mora 30+ dias', current: 3.8, unit: '%', limitMax: 5.0, signal: 'green', trend: [3.5, 3.6, 3.7, 3.7, 3.8, 3.8], description: 'Cartera con atrasos â‰¥ 30 dias' },
  { id: 'top10', name: 'Concentracion Top 10', current: 11.2, unit: '%', limitMax: 15.0, signal: 'green', trend: [12.4, 12.1, 11.8, 11.6, 11.4, 11.2], description: '% cartera concentrado en los 10 mayores deudores' },
  { id: 'rollCD', name: 'Roll Rate 61-90 â†’ 90+', current: 31.2, unit: '%', limitMax: 30.0, signal: 'red', trend: [27.8, 28.4, 29.1, 29.8, 30.5, 31.2], description: 'Tasa de deterioro de bucket C a D (excede limite)' },
  { id: 'coverage', name: 'Coverage Ratio', current: 118, unit: '%', limitMin: 120.0, signal: 'red', trend: [124, 122, 121, 120, 119, 118], description: 'Cobertura de previsiones sobre cartera en mora 90+' },
  { id: 'netflow', name: 'Netflow Mensual', current: 0.5, unit: 'M', limitMax: 0.0, signal: 'amber', trend: [0.9, 1.9, 2.1, 0.5, -1.7, -0.6], description: 'Objetivo: netflow â‰¤ 0 (mes curas+castigos que entradas)' },
  { id: 'aprob', name: 'Tasa Aprobacion', current: 62.4, unit: '%', limitMin: 45, limitMax: 70, signal: 'green', trend: [65.2, 64.5, 63.8, 63.2, 62.7, 62.4], description: 'Debe mantenerse dentro del rango 45-70%' },
  { id: 'iswasC', name: 'IS/WAS Score C', current: 1.16, unit: 'ratio', limitMax: 1.2, signal: 'amber', trend: [1.11, 1.13, 1.13, 1.14, 1.15, 1.16], description: 'Mora realizada vs esperada en segmento C' },
]

// â”€â”€â”€ 6.10 Rentabilidad â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const profitabilityByProduct: ProductProfitability[] = [
  { product: 'Tarjeta de credito', productKey: 'tarjeta', cartera: 1820, nim: 28.4, spread: 22.1, costoRiesgo: 4.2, rentabilidadNeta: 17.9 },
  { product: 'Prestamo personal', productKey: 'prestamo_personal', cartera: 1450, nim: 24.6, spread: 18.3, costoRiesgo: 5.8, rentabilidadNeta: 12.5 },
  { product: 'Hipotecario', productKey: 'hipotecario', cartera: 980, nim: 8.2, spread: 4.1, costoRiesgo: 0.8, rentabilidadNeta: 3.3 },
  { product: 'Automotriz', productKey: 'automotriz', cartera: 600, nim: 18.9, spread: 12.4, costoRiesgo: 2.1, rentabilidadNeta: 10.3 },
]
export const profitabilityTotal = {
  cartera: 4850, nim: 22.0, spread: 16.1, costoRiesgo: 3.7, rentabilidadNeta: 12.2,
}
export const profitabilityKpis = { roa: 2.8, roe: 18.2, eficiencia: 48.2 }

export const roaNimTimeline = [
  { mes: 'Jun-25', roa: 2.4, nim: 21.2 },
  { mes: 'Jul-25', roa: 2.5, nim: 21.4 },
  { mes: 'Ago-25', roa: 2.5, nim: 21.5 },
  { mes: 'Sep-25', roa: 2.6, nim: 21.7 },
  { mes: 'Oct-25', roa: 2.6, nim: 21.8 },
  { mes: 'Nov-25', roa: 2.7, nim: 21.9 },
  { mes: 'Dic-25', roa: 2.7, nim: 22.0 },
  { mes: 'Ene-26', roa: 2.7, nim: 22.0 },
  { mes: 'Feb-26', roa: 2.8, nim: 22.0 },
  { mes: 'Mar-26', roa: 2.8, nim: 22.1 },
  { mes: 'Abr-26', roa: 2.8, nim: 22.1 },
  { mes: 'May-26', roa: 2.8, nim: 22.1 },
]

// â”€â”€â”€ 6.11 Segmentacion Score â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const scoreSegments: ScoreSegmentRow[] = [
  { segment: 'A', range: '>750', pctCartera: 32, pctMora: 0.9, nim: 15.2, rentabilidadNeta: 12.8 },
  { segment: 'B', range: '650-750', pctCartera: 38, pctMora: 2.7, nim: 18.6, rentabilidadNeta: 14.1 },
  { segment: 'C', range: '550-650', pctCartera: 22, pctMora: 6.4, nim: 22.4, rentabilidadNeta: 10.5 },
  { segment: 'D', range: '<550', pctCartera: 8, pctMora: 13.6, nim: 26.1, rentabilidadNeta: 5.8 },
]

// â”€â”€â”€ 6.12 Segmentacion Edad â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const ageSegments: AgeSegmentRow[] = [
  { range: '18-25', pctClientes: 12, pctMora: 6.2, ticketPromedio: 45000 },
  { range: '26-35', pctClientes: 28, pctMora: 3.8, ticketPromedio: 82000 },
  { range: '36-50', pctClientes: 38, pctMora: 2.9, ticketPromedio: 124000 },
  { range: '51-65', pctClientes: 18, pctMora: 2.4, ticketPromedio: 98000 },
  { range: '65+', pctClientes: 4, pctMora: 1.8, ticketPromedio: 67000 },
]

export const ageVsScoreHeatmap = [
  { range: '18-25', A: 1.6, B: 4.2, C: 9.8, D: 18.4 },
  { range: '26-35', A: 1.0, B: 3.0, C: 6.9, D: 14.8 },
  { range: '36-50', A: 0.8, B: 2.4, C: 5.6, D: 12.1 },
  { range: '51-65', A: 0.6, B: 2.0, C: 4.8, D: 10.6 },
  { range: '65+', A: 0.5, B: 1.5, C: 3.7, D: 8.9 },
]

// â”€â”€â”€ 6.13 Alertas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const alerts: AlertItem[] = [
  { id: '1', severity: 'critico', title: 'Roll Rate 61-90 â†’ 90+ supera limite', detail: 'Valor actual 31.2% vs limite 30%. Tendencia ascendente ultimos 6 meses.', metric: 'rollCD', module: 'Límites de Riesgo', timestamp: 'Hoy 09:14' },
  { id: '2', severity: 'critico', title: 'Coverage Ratio por debajo de minimo', detail: 'Coverage actual 118% vs minimo 120%. Se requiere revisar previsiones.', metric: 'coverage', module: 'Límites de Riesgo', timestamp: 'Hoy 09:14' },
  { id: '3', severity: 'alerta', title: 'Netflow positivo 2 meses consecutivos en Score C', detail: 'Segmento C acumula entradas a mora > curas en Mar y Abr.', metric: 'netflow', module: 'Calidad de Cartera', timestamp: 'Ayer 18:22' },
  { id: '4', severity: 'alerta', title: 'IS/WAS Score B supera 1.05 por tercer mes', detail: 'Ratio actual 1.09. Revisar politica de pricing del segmento.', metric: 'iswasB', module: 'Calidad de Cartera', timestamp: '25/05 11:04' },
  { id: '5', severity: 'info', title: 'Vintage Feb-2024 mejora vs. cosecha equivalente 2023', detail: 'M12: 3.5% vs 4.1% en Feb-2023.', metric: 'vintage', module: 'Calidad de Cartera', timestamp: '23/05 15:00' },
  { id: '6', severity: 'ok', title: 'NPL 90+ debajo del limite por 6 meses consecutivos', detail: '1.9% vs limite 2.5%.', metric: 'npl90', module: 'Límites de Riesgo', timestamp: '20/05 10:00' },
  { id: '7', severity: 'ok', title: 'Activacion 30d supera benchmark historico', detail: '76.0% actual vs 72.0% benchmark.', metric: 'activacion', module: 'Ciclo de Vida', timestamp: '20/05 10:00' },
]
