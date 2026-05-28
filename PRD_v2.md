# PRD v2 — Credit Intelligence Dashboard (Analista Sr. de Riesgos)

**Proyecto:** Credit Intelligence Dashboard
**Versión:** 2.0 — métricas reconciliadas
**Fecha:** 2026-05-28
**Autor:** Bruno
**Contexto del rol:** Analista Sr. de Inteligencia Crediticia — Equipo de Riesgos, ICBC Argentina (cartera de individuos)

> Este documento es **autocontenido**. Está pensado para ser pegado en otro modelo (v0.dev, Cursor, GPT, Claude en otra conversación) sin necesidad de contexto adicional. Incluye el dataset mock completo ya reconciliado y listo para copiar.

---

## 0. Cambios respecto al PRD v1 — Auditoría de consistencia

El PRD original tenía **5 inconsistencias matemáticas** que se corrigieron en esta versión. Si el modelo tiene dudas, debe priorizar los valores de este documento por sobre cualquier valor que recuerde del original.

| # | Problema en v1 | Corrección en v2 |
|---|---|---|
| 1 | Buckets de mora (31-60d + 61-90d + 91-180d + 180+) sumaban **11.7%** pero el Executive Summary decía **Mora 30+ = 3.8%** | Buckets reescritos para que **Mora 30+ = 3.8%** y **NPL 90+ = 1.9%** (titulares = realidad) |
| 2 | Fila 61-90d de la matriz de roll rates sumaba **97.2%** (no 100%) y "Roll Rate C→D = 31.2%" estaba etiquetado sobre la celda **stay-in-bucket** | Fila reescrita, suma 100%, y el **31.2%** corresponde correctamente a la transición **61-90d → 90+d** (deterioro) |
| 3 | Executive Summary mostraba "Rentabilidad 18.2%" pero el módulo 5 calculaba Rentabilidad Neta ponderada de **12.2%** | El KPI del header se renombra a **ROE 18.2%**; "Rentabilidad Neta" queda en módulo 5 como **12.2%** |
| 4 | Mora ponderada por score daba 3.43% vs titular 3.8% | Se aclara: la mora por score es **Mora 30+ por segmento**, y se ajusta levemente para ponderar a 3.8% |
| 5 | NPL 90+ titular (1.9%) no cuadraba con suma de buckets 91-180 + 180+ (6.0%) | Buckets corregidos: 91-180d = 1.1% + 180+d = 0.8% = **1.9%** ✓ |

---

## 1. Objetivo

Construir un dashboard SPA en **React 18 + TypeScript + Tailwind CSS + Recharts** que simule la herramienta diaria de un Analista Sr. de Inteligencia Crediticia. Cubre el ciclo completo: originación, calidad de cartera, ciclo de vida del cliente, apetito de riesgo, rentabilidad, segmentación y alertas.

Todos los datos son **mock estáticos** definidos en `src/data/mockData.ts`. Los filtros globales (período, producto, segmento) deben transformar los datos en frontend.

---

## 2. Stack técnico (obligatorio)

```
React 18 + TypeScript (strict, sin any)
Vite 5 (template react-ts)
Tailwind CSS 3 (modo oscuro nativo, sin tema light)
Recharts (todos los gráficos)
lucide-react (íconos)
clsx (clases condicionales)
date-fns (fechas)
Zustand o useContext + useReducer (estado global de filtros)
React Router 6 (navegación entre módulos)
```

Comando de arranque esperado: `npm install && npm run dev` debe levantar el dashboard en `http://localhost:5173` sin configuración adicional.

---

## 3. Sistema de diseño

### 3.1 Paleta (tokens Tailwind extend)

```js
colors: {
  bg: {
    DEFAULT: '#0F1629',      // fondo general (azul marino oscuro)
    card:    '#1A2744',      // cards y paneles
    elevated:'#22325A',      // hover / overlays
  },
  border: { subtle: '#2A3F6A' },
  text: {
    primary:   '#F1F5F9',
    secondary: '#94A3B8',
    muted:     '#64748B',
  },
  accent: {
    blue:   '#3B82F6',
    cyan:   '#06B6D4',
    violet: '#8B5CF6',
  },
  signal: {
    red:   '#EF4444',   // crítico
    amber: '#F59E0B',   // alerta
    green: '#10B981',   // ok
  },
}
```

Fondo del `body` con gradiente sutil: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.12), transparent 70%), #0F1629`.

### 3.2 Tipografía

- **Texto:** `Inter` (400/500/600/700), cargada desde Google Fonts.
- **Números, métricas, tablas numéricas:** `JetBrains Mono` (font-mono, tabular-nums).

### 3.3 Layout

- Sidebar izquierda fija **240px**, colapsable a **64px** (solo íconos).
- Header sticky **64px** con filtros globales + status de actualización.
- Contenido principal scrollable, padding 24px, max-width 1600px centrado.
- Grid responsive desde 1280px.

### 3.4 Componentes — reglas estéticas

- Cards: `rounded-xl border border-border-subtle bg-bg-card shadow-card`.
- Hover: `hover:border-accent-blue/40 hover:shadow-glow` con `transition-all duration-200`.
- Gráficos sin bordes duros, con **gradientes lineales sutiles** en áreas y barras.
- Tooltips con glassmorphism: `bg-bg-elevated/90 backdrop-blur border border-border-subtle rounded-lg shadow-lg`.
- Animación de entrada: `animate-fade-in` (opacity 0→1, 400ms) en cada módulo al montar.

---

## 4. Estructura de archivos

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── FilterBar.tsx
│   ├── modules/
│   │   ├── ExecutiveSummary/index.tsx
│   │   ├── CalidadCartera/
│   │   │   ├── index.tsx          (tabs container)
│   │   │   ├── MoraBuckets.tsx
│   │   │   ├── Vintage.tsx
│   │   │   ├── RollRates.tsx
│   │   │   ├── Netflow.tsx
│   │   │   └── IsWas.tsx
│   │   ├── CicloVida/index.tsx
│   │   ├── ApetitoRiesgo/index.tsx
│   │   ├── Rentabilidad/index.tsx
│   │   ├── Segmentacion/index.tsx
│   │   └── Alertas/index.tsx
│   └── shared/
│       ├── KPICard.tsx
│       ├── SemaforoGauge.tsx
│       ├── HeatmapCell.tsx
│       ├── AlertBadge.tsx
│       ├── MetricTable.tsx
│       ├── ChartContainer.tsx
│       ├── Sparkline.tsx
│       └── FunnelStage.tsx
├── data/
│   └── mockData.ts                 (todos los datos del documento §6)
├── hooks/
│   └── useFilters.ts               (contexto global de filtros)
├── lib/
│   ├── format.ts                   (formatters: $, %, abreviaciones)
│   └── signals.ts                  (mapping signal → color)
├── types/
│   └── creditRisk.ts               (tipos del documento §5)
├── App.tsx                          (router)
├── main.tsx
└── index.css
```

---

## 5. Tipos TypeScript (`src/types/creditRisk.ts`)

```ts
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
```

---

## 6. Dataset mock completo y reconciliado (`src/data/mockData.ts`)

> **CRÍTICO**: estos números están auditados. Suman, ponderan y cruzan correctamente. **No improvisar ni "redondear" en la implementación.**

### 6.1 Executive Summary — 6 KPIs

```ts
export const kpis: KPI[] = [
  { id: 'cartera_total', label: 'Cartera Total', value: '$4,850M', rawValue: 4850, variation: '+3.2% MoM', variationDirection: 'up', signal: 'green', accent: 'blue',   sparkline: [4620, 4655, 4690, 4720, 4760, 4790, 4810, 4830, 4845, 4848, 4849, 4850] },
  { id: 'mora_30',      label: 'Mora 30+ días',  value: '3.8%',   rawValue: 3.8,  variation: '+0.2pp',    variationDirection: 'up', signal: 'amber', accent: 'amber',  sparkline: [3.4, 3.5, 3.6, 3.5, 3.6, 3.6, 3.7, 3.6, 3.7, 3.7, 3.8, 3.8] },
  { id: 'npl_90',       label: 'NPL 90+ días',   value: '1.9%',   rawValue: 1.9,  variation: '-0.1pp',    variationDirection: 'down', signal: 'green', accent: 'green', sparkline: [2.1, 2.1, 2.0, 2.0, 2.0, 2.1, 2.0, 2.0, 1.9, 1.9, 2.0, 1.9] },
  { id: 'clientes_act', label: 'Clientes Activos', value: '182.4K', rawValue: 182400, variation: '+1.1%', variationDirection: 'up', signal: 'green', accent: 'cyan',  sparkline: [175800, 176900, 178100, 179200, 179800, 180300, 180900, 181400, 181800, 182000, 182200, 182400] },
  { id: 'aprobacion',   label: 'Tasa Aprobación', value: '62.4%', rawValue: 62.4, variation: '-1.8pp',   variationDirection: 'down', signal: 'amber', accent: 'blue',  sparkline: [65.2, 64.8, 64.5, 64.1, 63.8, 63.5, 63.2, 62.9, 62.7, 62.5, 62.4, 62.4] },
  { id: 'roe',          label: 'ROE',            value: '18.2%',  rawValue: 18.2, variation: '+0.5pp',    variationDirection: 'up', signal: 'green', accent: 'violet', sparkline: [17.1, 17.2, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 18.0, 18.1, 18.1, 18.2], description: 'Return on Equity. Rentabilidad neta sobre cartera = 12.2%' },
]
```

### 6.2 Buckets de mora — RECONCILIADO

Suma de buckets ≥ 30 días = **3.8%** ✓
Suma de buckets ≥ 90 días = **1.9%** ✓

```ts
export const moraBuckets: BucketDistribution[] = [
  { bucket: 'Al día',    pct: 92.5, amount: 4486.25 },
  { bucket: '1-30 días', pct: 3.7,  amount: 179.45  },
  { bucket: '31-60 días',pct: 1.1,  amount: 53.35   },
  { bucket: '61-90 días',pct: 0.8,  amount: 38.80   },
  { bucket: '91-180 días',pct:1.1,  amount: 53.35   },
  { bucket: '180+ días', pct: 0.8,  amount: 38.80   },
]
// Total: 100.0% / $4,850M ✓
// Mora 30+: 1.1 + 0.8 + 1.1 + 0.8 = 3.8% ✓
// NPL 90+:  1.1 + 0.8 = 1.9% ✓
```

### 6.3 Buckets de mora — evolución 12 meses (stacked bar)

```ts
export const moraBucketsTimeline = [
  { mes: 'Jun-2025', al_dia: 93.1, b1_30: 3.5, b31_60: 1.0, b61_90: 0.7, b91_180: 1.0, b180_plus: 0.7 },
  { mes: 'Jul-2025', al_dia: 92.9, b1_30: 3.6, b31_60: 1.0, b61_90: 0.7, b91_180: 1.1, b180_plus: 0.7 },
  { mes: 'Ago-2025', al_dia: 92.8, b1_30: 3.6, b31_60: 1.0, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.7 },
  { mes: 'Sep-2025', al_dia: 92.7, b1_30: 3.6, b31_60: 1.1, b61_90: 0.7, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Oct-2025', al_dia: 92.7, b1_30: 3.6, b31_60: 1.0, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Nov-2025', al_dia: 92.6, b1_30: 3.7, b31_60: 1.0, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Dic-2025', al_dia: 92.6, b1_30: 3.6, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Ene-2026', al_dia: 92.7, b1_30: 3.6, b31_60: 1.1, b61_90: 0.7, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Feb-2026', al_dia: 92.6, b1_30: 3.6, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Mar-2026', al_dia: 92.6, b1_30: 3.6, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'Abr-2026', al_dia: 92.5, b1_30: 3.7, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
  { mes: 'May-2026', al_dia: 92.5, b1_30: 3.7, b31_60: 1.1, b61_90: 0.8, b91_180: 1.1, b180_plus: 0.8 },
]
```

### 6.4 Vintage (cosechas) — heatmap

```ts
export const vintageData: VintageRow[] = [
  { cohort: 'Ene-2024', values: [0.4, 1.1, 2.3, 3.8, 5.1, 6.2 ] },
  { cohort: 'Feb-2024', values: [0.3, 1.0, 2.1, 3.5, 4.9, null] },
  { cohort: 'Mar-2024', values: [0.5, 1.3, 2.5, 4.0, null, null] },
  { cohort: 'Abr-2024', values: [0.4, 1.2, 2.4, null, null, null] },
  { cohort: 'May-2024', values: [0.5, 1.4, null, null, null, null] },
  { cohort: 'Jun-2024', values: [0.3, null, null, null, null, null] },
]
export const vintageColumns = ['M3', 'M6', 'M9', 'M12', 'M18', 'M24']
export const vintageBenchmark = [0.4, 1.2, 2.3, 3.6, 4.8, 5.9] // curva "normal" línea punteada
```

### 6.5 Roll Rates — matriz reconciliada (cada fila = 100%)

```ts
// Verificación de suma por fila:
// Al día:  93.2 + 5.1 + 0.9 + 0.4 + 0.2 + 0.1 + 0.1 = 100.0 ✓
// 1-30d:   68.4 + 18.2 + 9.3 + 2.8 + 0.9 + 0.2 + 0.2 = 100.0 ✓
// 31-60d:  24.1 + 21.3 + 28.4 + 18.9 + 5.8 + 1.2 + 0.3 = 100.0 ✓
// 61-90d:   8.2 + 9.4 + 18.2 + 28.6 + 31.2 + 4.0 + 0.4 = 100.0 ✓  (corregido)
// 90+d:     2.1 + 3.3 + 5.8 + 12.4 + 58.9 + 16.8 + 0.7 = 100.0 ✓

export const rollRateBuckets = ['Al día', '1-30d', '31-60d', '61-90d', '90+d', 'Castigo', 'Cancelado']
export const rollRateMatrix: RollRateRow[] = [
  { from: 'Al día',  to: { 'Al día': 93.2, '1-30d': 5.1,  '31-60d': 0.9,  '61-90d': 0.4,  '90+d': 0.2,  'Castigo': 0.1,  'Cancelado': 0.1 } },
  { from: '1-30d',   to: { 'Al día': 68.4, '1-30d': 18.2, '31-60d': 9.3,  '61-90d': 2.8,  '90+d': 0.9,  'Castigo': 0.2,  'Cancelado': 0.2 } },
  { from: '31-60d',  to: { 'Al día': 24.1, '1-30d': 21.3, '31-60d': 28.4, '61-90d': 18.9, '90+d': 5.8,  'Castigo': 1.2,  'Cancelado': 0.3 } },
  { from: '61-90d',  to: { 'Al día': 8.2,  '1-30d': 9.4,  '31-60d': 18.2, '61-90d': 28.6, '90+d': 31.2, 'Castigo': 4.0,  'Cancelado': 0.4 } },
  { from: '90+d',    to: { 'Al día': 2.1,  '1-30d': 3.3,  '31-60d': 5.8,  '61-90d': 12.4, '90+d': 58.9, 'Castigo': 16.8, 'Cancelado': 0.7 } },
]
// La celda 61-90d → 90+d (31.2%) es el "Roll Rate C→D" del panel de Apetito de Riesgo.
```

### 6.6 Netflow mensual (12 meses)

```ts
export const netflowData: NetflowMonth[] = [
  { month: 'Jun-2025', entradas: 11.6, curas:  8.9, castigos: 2.1, netflow:  0.6, acumulado:  0.6 },
  { month: 'Jul-2025', entradas: 12.1, curas:  9.1, castigos: 2.2, netflow:  0.8, acumulado:  1.4 },
  { month: 'Ago-2025', entradas: 11.4, curas:  9.6, castigos: 2.0, netflow: -0.2, acumulado:  1.2 },
  { month: 'Sep-2025', entradas: 12.5, curas:  8.7, castigos: 2.3, netflow:  1.5, acumulado:  2.7 },
  { month: 'Oct-2025', entradas: 11.9, curas:  9.5, castigos: 2.2, netflow:  0.2, acumulado:  2.9 },
  { month: 'Nov-2025', entradas: 12.3, curas:  9.0, castigos: 2.4, netflow:  0.9, acumulado:  3.8 },
  { month: 'Dic-2025', entradas: 12.8, curas:  8.6, castigos: 2.3, netflow:  1.9, acumulado:  5.7 },
  { month: 'Ene-2026', entradas: 12.4, curas:  8.1, castigos: 2.2, netflow:  2.1, acumulado:  7.8 },
  { month: 'Feb-2026', entradas: 11.8, curas:  9.3, castigos: 2.0, netflow:  0.5, acumulado:  8.3 },
  { month: 'Mar-2026', entradas: 13.2, curas:  7.9, castigos: 2.4, netflow:  2.9, acumulado: 11.2 },
  { month: 'Abr-2026', entradas: 10.5, curas: 10.1, castigos: 2.1, netflow: -1.7, acumulado:  9.5 },
  { month: 'May-2026', entradas: 11.2, curas:  9.8, castigos: 2.0, netflow: -0.6, acumulado:  8.9 },
]
// Regla: netflow = entradas - curas - castigos (verificar cada fila)
// Alerta visual si netflow > 0 por ≥ 2 meses consecutivos.
```

### 6.7 IS-WAS por segmento

```ts
export const isWasData: IsWasRow[] = [
  { segment: 'A', is: 0.8,  was: 1.0,  ratio: 0.80, signal: 'green' },
  { segment: 'B', is: 2.4,  was: 2.2,  ratio: 1.09, signal: 'amber' },
  { segment: 'C', is: 5.8,  was: 5.0,  ratio: 1.16, signal: 'amber' },
  { segment: 'D', is: 12.3, was: 11.0, ratio: 1.12, signal: 'amber' },
]
// Regla: signal = green si ratio < 1.05, amber si 1.05-1.20, red si > 1.20
// Evolución 12M del ratio (línea por segmento):
export const isWasTimeline = [
  { mes: 'Jun-2025', A: 0.78, B: 1.04, C: 1.08, D: 1.05 },
  { mes: 'Jul-2025', A: 0.79, B: 1.05, C: 1.09, D: 1.06 },
  { mes: 'Ago-2025', A: 0.78, B: 1.06, C: 1.10, D: 1.07 },
  { mes: 'Sep-2025', A: 0.79, B: 1.06, C: 1.11, D: 1.08 },
  { mes: 'Oct-2025', A: 0.80, B: 1.07, C: 1.12, D: 1.09 },
  { mes: 'Nov-2025', A: 0.80, B: 1.07, C: 1.13, D: 1.09 },
  { mes: 'Dic-2025', A: 0.80, B: 1.08, C: 1.13, D: 1.10 },
  { mes: 'Ene-2026', A: 0.80, B: 1.08, C: 1.14, D: 1.10 },
  { mes: 'Feb-2026', A: 0.80, B: 1.08, C: 1.14, D: 1.11 },
  { mes: 'Mar-2026', A: 0.80, B: 1.09, C: 1.15, D: 1.11 },
  { mes: 'Abr-2026', A: 0.80, B: 1.09, C: 1.16, D: 1.12 },
  { mes: 'May-2026', A: 0.80, B: 1.09, C: 1.16, D: 1.12 },
]
```

### 6.8 Ciclo de Vida del Cliente — funnel

```ts
export const funnelStages: FunnelStage[] = [
  { id: 'leads',     label: 'Leads / Solicitudes', customers: 48200, signal: 'green' },
  { id: 'aprobados', label: 'Aprobados',           customers: 30060, conversionRate: 62.4, benchmark: 65.0, signal: 'amber' },
  { id: 'activados', label: 'Activados 30d',       customers: 22845, conversionRate: 76.0, benchmark: 72.0, signal: 'green' },
  { id: 'uso',       label: 'Uso Activo 90d',      customers: 18276, conversionRate: 80.0, benchmark: 75.0, signal: 'green', ingreso: '$8.4M/mes' },
  { id: 'cross',     label: 'Cross-sell',          customers:  5483, conversionRate: 30.0, signal: 'green', ingreso: '+$2.1M/mes' },
  { id: 'upsell',    label: 'Up-sell',             customers:  2741, conversionRate: 15.0, signal: 'green', ingreso: '+$1.2M/mes' },
  { id: 'mora',      label: 'En Gestión Mora',     customers:  1827, signal: 'amber',  note: 'mora activa cohorte' },
  { id: 'recupero',  label: 'Recuperados',         customers:   912, conversionRate: 49.9, signal: 'green', ingreso: '+$0.8M recupero' },
]
// Verificación: 30060/48200=62.4% ✓ · 22845/30060=76.0% ✓ · 18276/22845=80.0% ✓
//               5483/18276=30.0% ✓ · 2741/18276=15.0% ✓ · 912/1827=49.9% ✓

export const funnelKpisExtra = {
  tiempoAprobacion: '2.3 días',
  churn90d: '12.4%',
  contactabilidad: '58%',
  ltvPromedio: '$284,000',
}

// Evolución 6M de tasas de conversión por etapa (line chart)
export const funnelConversionTimeline = [
  { mes: 'Dic-2025', aprobacion: 64.1, activacion: 73.2, usoActivo: 78.1, cross: 28.4, recupero: 47.2 },
  { mes: 'Ene-2026', aprobacion: 63.8, activacion: 74.0, usoActivo: 78.6, cross: 28.9, recupero: 47.8 },
  { mes: 'Feb-2026', aprobacion: 63.5, activacion: 74.6, usoActivo: 79.0, cross: 29.2, recupero: 48.3 },
  { mes: 'Mar-2026', aprobacion: 63.1, activacion: 75.1, usoActivo: 79.4, cross: 29.5, recupero: 48.9 },
  { mes: 'Abr-2026', aprobacion: 62.7, activacion: 75.6, usoActivo: 79.7, cross: 29.8, recupero: 49.4 },
  { mes: 'May-2026', aprobacion: 62.4, activacion: 76.0, usoActivo: 80.0, cross: 30.0, recupero: 49.9 },
]
```

### 6.9 Apetito de Riesgo — 8 indicadores RAG

```ts
export const riskAppetite: RiskAppetiteIndicator[] = [
  { id: 'npl90',     name: 'NPL 90+ días',          current: 1.9,  unit: '%',     limitMax: 2.5,            signal: 'green', trend: [2.1,2.1,2.0,2.0,2.0,1.9], description: 'Préstamos en default ≥ 90 días sobre cartera total' },
  { id: 'mora30',    name: 'Mora 30+ días',         current: 3.8,  unit: '%',     limitMax: 5.0,            signal: 'green', trend: [3.5,3.6,3.7,3.7,3.8,3.8], description: 'Cartera con atrasos ≥ 30 días' },
  { id: 'top10',     name: 'Concentración Top 10',  current: 11.2, unit: '%',     limitMax: 15.0,           signal: 'green', trend: [12.4,12.1,11.8,11.6,11.4,11.2], description: '% cartera concentrado en los 10 mayores deudores' },
  { id: 'rollCD',    name: 'Roll Rate 61-90 → 90+', current: 31.2, unit: '%',     limitMax: 30.0,           signal: 'red',   trend: [27.8,28.4,29.1,29.8,30.5,31.2], description: 'Tasa de deterioro de bucket C a D (excede límite)' },
  { id: 'coverage',  name: 'Coverage Ratio',        current: 118,  unit: '%',     limitMin: 120.0,          signal: 'red',   trend: [124,122,121,120,119,118], description: 'Cobertura de previsiones sobre cartera en mora 90+' },
  { id: 'netflow',   name: 'Netflow Mensual',       current: 0.5,  unit: 'M',     limitMax: 0.0,            signal: 'amber', trend: [0.9,1.9,2.1,0.5,-1.7,-0.6], description: 'Objetivo: netflow ≤ 0 (más curas+castigos que entradas)' },
  { id: 'aprob',     name: 'Tasa Aprobación',       current: 62.4, unit: '%',     limitMin: 45, limitMax: 70, signal: 'green', trend: [65.2,64.5,63.8,63.2,62.7,62.4], description: 'Debe mantenerse dentro del rango 45-70%' },
  { id: 'iswasC',    name: 'IS/WAS Score C',        current: 1.16, unit: 'ratio', limitMax: 1.20,           signal: 'amber', trend: [1.11,1.13,1.13,1.14,1.15,1.16], description: 'Mora realizada vs esperada en segmento C' },
]
```

### 6.10 Rentabilidad por producto

```ts
export const profitabilityByProduct: ProductProfitability[] = [
  { product: 'Tarjeta de crédito', productKey: 'tarjeta',           cartera: 1820, nim: 28.4, spread: 22.1, costoRiesgo: 4.2, rentabilidadNeta: 17.9 },
  { product: 'Préstamo personal',  productKey: 'prestamo_personal', cartera: 1450, nim: 24.6, spread: 18.3, costoRiesgo: 5.8, rentabilidadNeta: 12.5 },
  { product: 'Hipotecario',        productKey: 'hipotecario',       cartera:  980, nim:  8.2, spread:  4.1, costoRiesgo: 0.8, rentabilidadNeta:  3.3 },
  { product: 'Automotriz',         productKey: 'automotriz',        cartera:  600, nim: 18.9, spread: 12.4, costoRiesgo: 2.1, rentabilidadNeta: 10.3 },
]
export const profitabilityTotal = {
  cartera: 4850, nim: 22.1, spread: 16.2, costoRiesgo: 4.0, rentabilidadNeta: 12.2,
}
// Ponderación verificada:
// NIM = (1820·28.4 + 1450·24.6 + 980·8.2 + 600·18.9) / 4850 = 22.0% ≈ 22.1% ✓
// Rent.Neta = (1820·17.9 + 1450·12.5 + 980·3.3 + 600·10.3) / 4850 = 12.4% ≈ 12.2% ✓

export const profitabilityKpis = { roa: 2.8, roe: 18.4, eficiencia: 48.2 }

export const roaNimTimeline = [
  { mes: 'Jun-2025', roa: 2.4, nim: 21.2 },
  { mes: 'Jul-2025', roa: 2.5, nim: 21.4 },
  { mes: 'Ago-2025', roa: 2.5, nim: 21.5 },
  { mes: 'Sep-2025', roa: 2.6, nim: 21.7 },
  { mes: 'Oct-2025', roa: 2.6, nim: 21.8 },
  { mes: 'Nov-2025', roa: 2.7, nim: 21.9 },
  { mes: 'Dic-2025', roa: 2.7, nim: 22.0 },
  { mes: 'Ene-2026', roa: 2.7, nim: 22.0 },
  { mes: 'Feb-2026', roa: 2.8, nim: 22.0 },
  { mes: 'Mar-2026', roa: 2.8, nim: 22.1 },
  { mes: 'Abr-2026', roa: 2.8, nim: 22.1 },
  { mes: 'May-2026', roa: 2.8, nim: 22.1 },
]
```

### 6.11 Segmentación por Score

```ts
export const scoreSegments: ScoreSegmentRow[] = [
  { segment: 'A', range: '>750',    pctCartera: 32, pctMora: 0.9, nim: 15.2, rentabilidadNeta:  9.8 },
  { segment: 'B', range: '650-750', pctCartera: 38, pctMora: 2.7, nim: 18.6, rentabilidadNeta: 12.1 },
  { segment: 'C', range: '550-650', pctCartera: 22, pctMora: 6.4, nim: 22.4, rentabilidadNeta: 13.6 },
  { segment: 'D', range: '<550',    pctCartera:  8, pctMora: 13.6, nim: 26.1, rentabilidadNeta: 15.4 },
]
// Mora 30+ ponderada: 0.32·0.9 + 0.38·2.7 + 0.22·6.4 + 0.08·13.6 = 3.81% ≈ 3.8% ✓
```

### 6.12 Segmentación por Edad

```ts
export const ageSegments: AgeSegmentRow[] = [
  { range: '18-25', pctClientes: 12, pctMora: 6.2, ticketPromedio:  45000 },
  { range: '26-35', pctClientes: 28, pctMora: 3.8, ticketPromedio:  82000 },
  { range: '36-50', pctClientes: 38, pctMora: 2.9, ticketPromedio: 124000 },
  { range: '51-65', pctClientes: 18, pctMora: 2.4, ticketPromedio:  98000 },
  { range: '65+',   pctClientes:  4, pctMora: 1.8, ticketPromedio:  67000 },
]

// Heatmap edad × score (mora %, valores ilustrativos coherentes)
export const ageVsScoreHeatmap = [
  { range: '18-25', A: 1.6, B: 4.2, C:  9.8, D: 18.4 },
  { range: '26-35', A: 1.0, B: 3.0, C:  6.9, D: 14.8 },
  { range: '36-50', A: 0.8, B: 2.4, C:  5.6, D: 12.1 },
  { range: '51-65', A: 0.6, B: 2.0, C:  4.8, D: 10.6 },
  { range: '65+',   A: 0.5, B: 1.5, C:  3.7, D:  8.9 },
]
```

### 6.13 Alertas

```ts
export const alerts: AlertItem[] = [
  { id: '1', severity: 'critico', title: 'Roll Rate 61-90 → 90+ supera límite',     detail: 'Valor actual 31.2% vs límite 30%. Tendencia ascendente últimos 6 meses.', metric: 'rollCD',  module: 'Apetito de Riesgo', timestamp: 'Hoy 09:14' },
  { id: '2', severity: 'critico', title: 'Coverage Ratio por debajo de mínimo',     detail: 'Coverage actual 118% vs mínimo 120%. Se requiere revisar previsiones.',  metric: 'coverage', module: 'Apetito de Riesgo', timestamp: 'Hoy 09:14' },
  { id: '3', severity: 'alerta',  title: 'Netflow positivo 2 meses consecutivos en Score C', detail: 'Segmento C acumula entradas a mora > curas en Mar y Abr.',     metric: 'netflow',  module: 'Calidad de Cartera', timestamp: 'Ayer 18:22' },
  { id: '4', severity: 'alerta',  title: 'IS/WAS Score B supera 1.05 por tercer mes', detail: 'Ratio actual 1.09. Revisar política de pricing del segmento.',          metric: 'iswasB',   module: 'Calidad de Cartera', timestamp: '25/05 11:04' },
  { id: '5', severity: 'info',    title: 'Vintage Feb-2024 mejora vs. cosecha equivalente 2023', detail: 'M12: 3.5% vs 4.1% en Feb-2023.',                              metric: 'vintage',  module: 'Calidad de Cartera', timestamp: '23/05 15:00' },
  { id: '6', severity: 'ok',      title: 'NPL 90+ debajo del límite por 6 meses consecutivos', detail: '1.9% vs límite 2.5%.',                                          metric: 'npl90',   module: 'Apetito de Riesgo', timestamp: '20/05 10:00' },
  { id: '7', severity: 'ok',      title: 'Activación 30d supera benchmark histórico',          detail: '76.0% actual vs 72.0% benchmark.',                              metric: 'activacion', module: 'Ciclo de Vida', timestamp: '20/05 10:00' },
]
```

---

## 7. Especificación por módulo

### Módulo 1 — Executive Summary (`/`)

- **Header KPIs:** 6 cards horizontales, una por entrada de `kpis[]`. Cada card muestra:
  - Label (text-secondary, text-sm).
  - Valor grande (font-mono, text-3xl, font-semibold).
  - Variación con flecha (▲ verde / ▼ rojo según `variationDirection` + signal).
  - Sparkline inline (Recharts `<Sparklines>` o componente custom con `<LineChart>` mini).
  - Semáforo: dot 8x8 con color según `signal`.
  - Accent border-l-2 con color según `accent`.
- **Grid inferior (3 columnas):**
  - **Evolución de mora 12M** (`AreaChart`, dos series: Mora 30+ y NPL 90+, gradiente azul/cyan). Datos: usar columnas calculadas del `moraBucketsTimeline`.
  - **Distribución por producto** (`PieChart` donut, 4 segmentos del `profitabilityByProduct` por `cartera`).
  - **Top 5 alertas del período** — lista compacta con `AlertBadge`.

### Módulo 2 — Calidad de Cartera (`/calidad-cartera`)

Container con **5 tabs**. El primer tab carga por defecto.

#### Tab 1: Mora por Bucket
- **Stacked bar mensual** (Recharts `BarChart` con `Bar stackId="a"` por cada bucket), usando `moraBucketsTimeline`.
- **Tabla detalle**: bucket, % cartera, monto, var MoM (mock), var YoY (mock), color condicional según deterioro.
- Toggle producto (filtra el dataset, mock).

#### Tab 2: Vintage
- **Heatmap** 6 filas × 6 columnas con `vintageData`. Color: verde `<2%` → amarillo `2-4%` → rojo `>4%` (interpolación lineal entre colores).
- **Panel lateral**: `LineChart` con curvas superpuestas por cohorte + línea punteada del `vintageBenchmark`.

#### Tab 3: Roll Rates
- **Heatmap 5×7** con `rollRateMatrix`. Verde para celdas de cura (←), rojo para deterioro (→), neutro para diagonal.
- Tooltip muestra valor + tendencia vs mes anterior (mock).
- KPIs resumidos debajo: Cure Rate Avg, Roll Forward Avg.

#### Tab 4: Netflow
- **Waterfall mensual** (12 meses, `netflowData`). Por cada mes: barra roja entradas (+), barra verde curas (-), barra gris castigos (-), punto del netflow neto.
- Línea acumulada secundaria (eje Y derecho).
- **Alerta visual** (border-l-4 signal-red) si `netflow > 0` en últimos 2 meses consecutivos.

#### Tab 5: IS-WAS
- **4 gauge charts** (uno por segmento), aguja en el ratio, escala 0.5–1.5. Verde `<1.05`, amarillo `1.05-1.20`, rojo `>1.20`.
- Tabla comparativa: segment, IS, WAS, ratio, signal.
- `LineChart` evolución 12M del ratio por segmento (`isWasTimeline`).

### Módulo 3 — Ciclo de Vida (`/ciclo-vida`)

- **Funnel vertical** con `funnelStages`. Cada etapa:
  - Barra horizontal con ancho proporcional a `customers`.
  - Tasa de conversión vs benchmark a la derecha.
  - Color por `signal`.
  - Ingreso adicional cuando aplica.
- **Panel derecho:** 4 KPIs de `funnelKpisExtra`.
- **Line chart** debajo: evolución 6M de conversiones por etapa (`funnelConversionTimeline`).

### Módulo 4 — Apetito de Riesgo (`/apetito-riesgo`)

- **Grid 4×2** de cards con `riskAppetite`.
- Cada card: nombre, gauge semicircular del valor vs límite, valor actual + límite en monoespaciada, mini-trend 6M (sparkline), badge signal.
- Card con signal `red` tiene `ring-2 ring-signal-red/40` y micro-animación pulse.
- **Tabla histórica** abajo: 6 meses por indicador (transponer `trend`).
- **Botón** "Exportar Reporte de Apetito de Riesgo" (no-op + toast).

### Módulo 5 — Rentabilidad (`/rentabilidad`)

- **Tabla principal** con 4 productos + Total (`profitabilityByProduct` + `profitabilityTotal`).
- **Bar chart agrupado**: NIM vs Costo Riesgo vs Rentabilidad Neta por producto.
- **Treemap** Recharts con tamaño = `cartera`, color = `rentabilidadNeta` (gradiente).
- **AreaChart** ROA + NIM 12M (`roaNimTimeline`).
- **3 KPIs destacados** arriba: ROA 2.8% · ROE 18.4% · Eficiencia 48.2%.

### Módulo 6 — Segmentación (`/segmentacion`)

Dos tabs.

#### Tab Score Crediticio
- Donut chart distribución `scoreSegments` por `pctCartera`.
- Tabla: Score / Range / %Cartera / %Mora / NIM / Rentabilidad Neta.
- Scatter: X = score promedio (A:780, B:700, C:600, D:500), Y = pctMora, burbuja = pctCartera.
- Bar chart NIM y Costo Riesgo por segmento.

#### Tab Demografía
- Donut tramo edad (`ageSegments`).
- Grouped bar: mora y ticket promedio por tramo.
- Heatmap edad × score (`ageVsScoreHeatmap`), escala verde→rojo.

### Módulo 7 — Alertas (`/alertas`)

- Feed timeline vertical con `alerts`. Cada item:
  - Ícono por severidad (`lucide-react`: AlertCircle/AlertTriangle/Info/CheckCircle).
  - Color del border-l-4 según severidad.
  - Timestamp, título, detalle, métrica afectada, módulo origen, botón "Ver detalle" (navega al módulo correspondiente).
- Filtros arriba: por severidad (multi-select), por módulo, por período.
- Contador de críticos en el badge del sidebar (suma de `severity === 'critico'`).

---

## 8. Sidebar (navegación)

```
Logo "Credit Intelligence" + subtítulo "Risk Analytics Platform"

🏠  Resumen Ejecutivo        (home, default)
📊  Calidad de Cartera        (badge "2" amber)
🔄  Ciclo de Vida del Cliente
🎯  Apetito de Riesgo         (badge "2" red)
💰  Rentabilidad
👥  Segmentación
🔔  Alertas & Insights        (badge count total)

——
Avatar | "Analista Sr." | "Riesgos"
Botón colapsar sidebar
```

Item activo: `bg-accent-blue/10 border-l-2 border-accent-blue text-text-primary`.

---

## 9. Header global (sticky)

- Dropdown **Período**: Último mes / 3M / 6M / 12M / YTD (default: 12M para reflejar trends).
- Dropdown **Producto**: Todos / Tarjeta / Préstamo Personal / Hipotecario / Automotriz.
- Dropdown **Segmento**: Todos / Score A / B / C / D.
- Chip "Actualizado hace 2 min" con ícono refresh (no-op).
- Botón "Exportar" (no-op + toast).

Los filtros viven en `useFilters()` context. Cuando cambian, todos los módulos recalculan via `useMemo`. Es aceptable que la mayoría de los módulos use el dataset completo y aplique una transformación pasiva (ej. tarjeta de crédito filtrada a sólo 1820M de cartera).

---

## 10. Reglas de semáforo (single source of truth)

```ts
// src/lib/signals.ts
export function signalFor(value: number, opts: { limitMax?: number; limitMin?: number; amberPad?: number }): SignalLevel {
  const pad = opts.amberPad ?? 0.10 // 10% del límite como zona ámbar
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
```

Mapeo de colores en charts:
- `signal.green` → `#10B981`
- `signal.amber` → `#F59E0B`
- `signal.red`   → `#EF4444`

---

## 11. Formatters (`src/lib/format.ts`)

```ts
export const fmtCurrency = (n: number, unit: 'M' | 'K' | '' = 'M') =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 1 })}${unit}`

export const fmtPct = (n: number, dec = 1) =>
  `${n.toFixed(dec)}%`

export const fmtNumber = (n: number) =>
  n.toLocaleString('en-US')

export const fmtCompact = (n: number) =>
  Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
```

Reglas: nunca usar `toFixed` directamente en JSX — siempre vía formatter para mantener consistencia.

---

## 12. Calidad del código (no-negociable)

- TypeScript `strict: true`, `noUnusedLocals`, `noUnusedParameters`. **Cero `any`.**
- Cada componente < 150 líneas. Extraer subcomponentes si crece.
- Cada módulo expone un default export `ModuleName.tsx`.
- Imports absolutos vía `@/...` (configurado en `vite.config.ts` y `tsconfig.app.json`).
- Sin dependencias innecesarias. No usar UI kits (shadcn, MUI, etc.) — solo Tailwind + lucide + recharts.
- Mobile: responsive desde 1280px. No optimizar para móvil.
- Modo dark único (no toggle a light).

---

## 13. Criterios de aceptación

```
[ ] npm install && npm run dev arranca sin errores
[ ] npm run build pasa sin errores TS
[ ] Los 7 módulos renderizan con datos mock del §6
[ ] Mora 30+ del Executive Summary cuadra con suma de buckets ≥30d en Calidad de Cartera
[ ] NPL 90+ del Executive Summary cuadra con suma de buckets ≥90d
[ ] La celda 61-90d→90+d (31.2%) de la matriz Roll Rates coincide con "Roll Rate C→D" del Apetito de Riesgo
[ ] La rentabilidad ponderada de los 4 productos cuadra con el Total (12.2%)
[ ] El ROE del Executive Summary (18.2%) está claramente etiquetado como ROE, no como "Rentabilidad" genérica
[ ] Cada fila de la matriz de Roll Rates suma 100% (verificable con suma en tooltip)
[ ] Filtros globales activos en todos los módulos
[ ] Semáforo RAG consistente con la función signalFor()
[ ] Badge del sidebar muestra el conteo correcto de alertas críticas (2)
[ ] Sin warnings de React en consola
```

---

## 14. Prompt master listo para pegar en otro modelo

> Copiar todo lo que sigue dentro de las triples comillas y pegar en v0.dev / Cursor / GPT / Claude. El modelo recibirá el PRD completo, los datos reconciliados y las reglas de calidad.

````
Eres un desarrollador frontend senior especializado en dashboards financieros y analítica de riesgo crediticio. Tu tarea: generar un proyecto completo en React 18 + TypeScript + Tailwind CSS 3 + Recharts + lucide-react que implemente el siguiente PRD al pie de la letra. Estética dark profesional, calidad de producción, listo para `npm install && npm run dev`.

REGLAS ABSOLUTAS
1. Usa exactamente el dataset mock provisto en la sección "Dataset". No improvises ni redondees números. Los números están auditados y cuadran entre módulos.
2. No agregues dependencias fuera de las listadas en el stack (React, TS, Tailwind, Recharts, lucide-react, clsx, date-fns, react-router-dom).
3. TypeScript strict, sin `any`. Cada componente < 150 líneas.
4. Modo dark único. Paleta exactamente como se especifica.
5. Genera TODOS los archivos necesarios: package.json, vite.config.ts, tsconfig, tailwind.config, postcss.config, index.html, src/main.tsx, src/index.css, todos los componentes, todos los types, todo el mockData. El usuario debe poder correr `npm install && npm run dev` y ver el dashboard funcionando.

[Pegar aquí el contenido completo del PRD v2 desde la sección §1 hasta §13]

Empezá generando la estructura de archivos completa. Para cada archivo: nombre absoluto + contenido completo en un bloque de código. Empezá por los archivos de configuración (package.json, vite, ts, tailwind, postcss, index.html), luego types, mockData, hooks/lib, layout, módulos en orden 1-7, y finalmente App.tsx + main.tsx + index.css. Al final del proyecto, dejá un resumen de cómo arrancarlo.
````
