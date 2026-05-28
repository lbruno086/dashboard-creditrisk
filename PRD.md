# PRD — Dashboard de Inteligencia Crediticia (Analista Sr. de Riesgos)

**Proyecto:** Credit Intelligence Dashboard  
**Fecha:** 2026-05-28  
**Autor:** Bruno (con asistencia de Claude Code)  
**Contexto:** Posición Analista de Inteligencia Crediticia Sr. — Equipo de Riesgos ICBC Argentina

---

## 1. Objetivo

Crear un dashboard en React que simule la herramienta de trabajo principal de un Analista de Inteligencia Crediticia Sr., cubriendo el 100% de las responsabilidades del puesto:

- Monitoreo de cartera crediticia de personas (individuos)
- Seguimiento del apetito de riesgo del banco
- Métricas de mora, rentabilidad y comportamiento de cartera
- Análisis del ciclo de vida del cliente
- Insights para políticas de crédito y gestión de cartera

---

## 2. Alcance del Dashboard

### 2.1 Módulos principales

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Executive Summary** | KPIs de cartera en tiempo real |
| 2 | **Calidad de Cartera** | Mora, Vintage, Roll Rates, Netflow, IS-WAS |
| 3 | **Ciclo de Vida del Cliente** | Funnel: Originación → Activación → Uso → Cross/Up-sell → Recupero |
| 4 | **Apetito de Riesgo** | Semáforo de cumplimiento vs. límites definidos |
| 5 | **Rentabilidad** | Spread, NIM, Revenue por segmento |
| 6 | **Segmentación de Cartera** | Concentración por producto, score, tramo |
| 7 | **Alertas & Insights** | Panel de señales automáticas |

---

## 3. Especificaciones por módulo

### Módulo 1 — Executive Summary (Header KPIs)

**Métricas clave (con valores de ejemplo):**

| Métrica | Valor Ejemplo | Variación |
|---------|--------------|-----------|
| Cartera Total | $4.850M | +3.2% MoM |
| Mora 30+ días | 3.8% | +0.2pp |
| Mora 90+ días (NPL) | 1.9% | -0.1pp |
| Clientes Activos | 182,400 | +1.1% |
| Tasa de Aprobación | 62.4% | -1.8pp |
| Rentabilidad Cartera | 18.2% | +0.5pp |

**UI:** Cards horizontales con sparkline inline, indicador de semáforo (verde/amarillo/rojo), flecha de tendencia.

---

### Módulo 2 — Calidad de Cartera

#### 2.1 Mora por Bucket (Aging)

Segmentación de mora en buckets estándar:

| Bucket | % Cartera |
|--------|-----------|
| Al día | 83.5% |
| 1-30 días | 4.8% |
| 31-60 días | 3.1% |
| 61-90 días | 2.6% |
| 91-180 días | 3.2% |
| 180+ días | 2.8% |

**UI:** Stacked bar chart + tabla detalle. Filtros: Producto (tarjeta, préstamo personal, hipotecario), Segmento, Período.

#### 2.2 Análisis Vintage

Muestra el % de mora acumulado por cosecha (mes de originación) a diferentes meses de vida.

```
Cosecha \ Mes de vida:  M3    M6    M9    M12   M18   M24
Ene-2024               0.4%  1.1%  2.3%  3.8%  5.1%  6.2%
Feb-2024               0.3%  1.0%  2.1%  3.5%  4.9%  —
Mar-2024               0.5%  1.3%  2.5%  4.0%  —     —
Abr-2024               0.4%  1.2%  2.4%  —     —     —
```

**UI:** Heatmap de cosechas + curvas de vintage superpuestas por línea temporal. Toggle entre productos.

#### 2.3 Roll Rates (Tasas de Flujo)

Matriz de transición entre buckets en el período:

|              | Al día | 1-30d | 31-60d | 61-90d | 90+d | Castigo | Cancelado |
|--------------|--------|-------|--------|--------|------|---------|-----------|
| **Al día**   | 93.2%  | 5.1%  | 0.9%   | 0.4%   | 0.2% | 0.1%    | 0.1%      |
| **1-30d**    | 68.4%  | 18.2% | 9.3%   | 2.8%   | 0.9% | 0.2%    | 0.2%      |
| **31-60d**   | 24.1%  | 21.3% | 28.4%  | 18.9%  | 5.8% | 1.2%    | 0.3%      |
| **61-90d**   | 8.2%   | 9.4%  | 22.1%  | 31.2%  | 25.4%| 3.4%    | 0.3%      |

**UI:** Heatmap con escala de color (verde = cura/mejora, rojo = deterioro). Click para drill-down por segmento.

#### 2.4 Netflow

Variación neta de cartera en mora en el período:

```
Netflow = Nuevas entradas en mora — Salidas (cura + castigo + cancelación)
```

| Mes | Entradas | Curas | Castigos | Netflow |
|-----|---------|-------|---------|---------|
| Ene | $12.4M | $8.1M | $2.2M | +$2.1M |
| Feb | $11.8M | $9.3M | $2.0M | +$0.5M |
| Mar | $13.2M | $7.9M | $2.4M | +$2.9M |
| Abr | $10.5M | $10.1M| $2.1M  | -$1.7M |

**UI:** Waterfall chart mensual. Línea de tendencia 12M. Alerta si Netflow positivo >2 meses consecutivos.

#### 2.5 IS-WAS (Índice de Siniestralidad)

Comparación de la tasa de mora actual vs. la esperada (modelo base):

| Segmento | Mora IS (actual) | Mora WAS (esperada) | Ratio IS/WAS |
|----------|-----------------|--------------------|-|
| Score A | 0.8% | 1.0% | 0.80 ✅ |
| Score B | 2.4% | 2.2% | 1.09 ⚠️ |
| Score C | 5.8% | 5.0% | 1.16 🔴 |
| Score D | 12.3% | 11.0% | 1.12 🔴 |

**UI:** Gauge charts por segmento + tabla comparativa con semáforo. Explica desviaciones significativas.

---

### Módulo 3 — Ciclo de Vida del Cliente

Funnel interactivo con métricas por etapa:

```
ORIGINACIÓN → ACTIVACIÓN → USO → CROSS-SELL / UP-SELL → GESTIÓN → RECUPERO
```

| Etapa | Clientes | Tasa conversión | Ingreso |
|-------|----------|----------------|---------|
| Leads / Solicitudes | 48,200 | — | — |
| Aprobados | 30,060 | 62.4% | — |
| Activados (30d) | 22,845 | 76.0% | — |
| Uso activo (90d) | 18,276 | 80.0% | $8.4M/mes |
| Cross-sell exitoso | 5,483 | 30.0% | +$2.1M/mes |
| Up-sell exitoso | 2,741 | 15.0% | +$1.2M/mes |
| En gestión de mora | 1,827 | (mora activa) | — |
| Recuperados | 912 | 49.9% | +$0.8M recuperado |

**UI:** Sankey chart o funnel vertical con flechas de conversión. Colores por salud de etapa. Filtros por producto y período.

**Métricas adicionales por etapa:**
- Tiempo promedio de aprobación: 2.3 días
- Churn rate 90d post-activación: 12.4%
- Contactabilidad en gestión: 58%
- Tasa de cura en recupero: 49.9%

---

### Módulo 4 — Apetito de Riesgo

Panel de semáforo con límites definidos por política:

| Indicador | Límite Máx | Límite Min | Valor Actual | Estado |
|-----------|-----------|-----------|-------------|--------|
| NPL 90+ días | 2.5% | — | 1.9% | ✅ Verde |
| Mora 30+ | 5.0% | — | 3.8% | ✅ Verde |
| Concentración Top 10 | 15% | — | 11.2% | ✅ Verde |
| Roll Rate C→D | 30% | — | 31.2% | ⚠️ Amarillo |
| Coverage Ratio | — | 120% | 118% | ⚠️ Amarillo |
| Netflow mensual | — | Negativo | +$0.5M | ⚠️ Amarillo |
| Tasa aprobación | 70% | 45% | 62.4% | ✅ Verde |
| IS/WAS Score C | 1.2 | — | 1.16 | ✅ Verde |

**UI:** Grid de cards con semáforo RAG (Red/Amber/Green). Gauge por cada indicador. Línea de tendencia 6M. Alertas exportables.

---

### Módulo 5 — Rentabilidad de Cartera

| Producto | Cartera | NIM | Spread | Costo Riesgo | Rentabilidad Neta |
|----------|---------|-----|--------|-------------|-------------------|
| Tarjeta de crédito | $1,820M | 28.4% | 22.1% | 4.2% | 17.9% |
| Préstamo personal | $1,450M | 24.6% | 18.3% | 5.8% | 12.5% |
| Hipotecario | $980M | 8.2% | 4.1% | 0.8% | 3.3% |
| Automotriz | $600M | 18.9% | 12.4% | 2.1% | 10.3% |
| Total | $4,850M | 22.1% | 16.2% | 4.0% | 12.2% |

**UI:** Bar chart agrupado (ingresos vs. costos). Treemap de cartera por producto. Línea de ROA/ROE 12 meses.

---

### Módulo 6 — Segmentación de Cartera

**Por Score Crediticio:**

| Segmento | % Cartera | % Mora | NIM Promedio |
|----------|-----------|--------|-------------|
| Score A (>750) | 32% | 0.8% | 15.2% |
| Score B (650-750) | 38% | 2.4% | 18.6% |
| Score C (550-650) | 22% | 5.8% | 22.4% |
| Score D (<550) | 8% | 12.3% | 26.1% |

**Por Tramo de Edad:**

| Tramo | % Clientes | % Mora | Ticket Promedio |
|-------|-----------|--------|----------------|
| 18-25 | 12% | 6.2% | $45,000 |
| 26-35 | 28% | 3.8% | $82,000 |
| 36-50 | 38% | 2.9% | $124,000 |
| 51-65 | 18% | 2.4% | $98,000 |
| 65+ | 4% | 1.8% | $67,000 |

**UI:** Donut charts + scatter plot Score vs. Mora. Filtros cruzados.

---

### Módulo 7 — Alertas & Insights Automáticos

Panel lateral o modal de alertas generadas por reglas:

```
🔴 CRÍTICO  — Roll Rate Bucket C→D supera límite de política (31.2% vs 30%)
⚠️  ALERTA  — Coverage Ratio por debajo de mínimo (118% vs 120%)
⚠️  ALERTA  — Netflow positivo 2 meses consecutivos en segmento Score C
🟡 INFO    — Vintage Feb-2024 muestra mejora vs. cosecha equivalente año anterior
🟢 OK      — NPL 90+ se mantiene por debajo del límite por 6 meses consecutivos
🟢 OK      — Tasa de activación 30d supera benchmark histórico (76% vs 72%)
```

---

## 4. Requisitos de UI/UX

### Estética (diseño profesional)

- **Paleta:** Fondo oscuro (#0F1629) con cards en (#1A2744), acentos en azul eléctrico (#3B82F6) y cyan (#06B6D4). Para alertas: rojo (#EF4444), amarillo (#F59E0B), verde (#10B981).
- **Tipografía:** Inter o Plus Jakarta Sans. Números en fuente monoespaciada (JetBrains Mono o IBM Plex Mono).
- **Layout:** Sidebar de navegación izquierda colapsable. Header con filtros globales (período, producto, segmento). Grid de contenido principal responsive.
- **Gráficos:** Recharts o Tremor. Sin bordes duros, con gradientes sutiles y sombras.
- **Interactividad:** Tooltips ricos en hover, drill-down en click, filtros que actualizan todos los módulos en tiempo real.

### Filtros globales (sticky header)

- Período: Últimos 30d / 3M / 6M / 12M / YTD / Custom
- Producto: Todos / Tarjeta / Préstamo Personal / Hipotecario / Automotriz
- Segmento: Todos / Score A / B / C / D
- Región/Sucursal (placeholder)

---

## 5. Stack Técnico Recomendado

```
React 18 + TypeScript
Tailwind CSS (dark mode nativo)
Recharts o Tremor para gráficos
React Router (navegación entre módulos)
Zustand o Context API (estado de filtros)
date-fns (manejo de fechas)
Todos los datos: mock/estáticos en /src/data/mockData.ts
```

---

## 6. Estructura de archivos sugerida

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── FilterBar.tsx
│   ├── modules/
│   │   ├── ExecutiveSummary/
│   │   ├── CalidadCartera/
│   │   │   ├── MoraBuckets.tsx
│   │   │   ├── Vintage.tsx
│   │   │   ├── RollRates.tsx
│   │   │   ├── Netflow.tsx
│   │   │   └── IsWas.tsx
│   │   ├── CicloVida/
│   │   ├── ApetitorRiesgo/
│   │   ├── Rentabilidad/
│   │   ├── Segmentacion/
│   │   └── Alertas/
│   └── shared/
│       ├── KPICard.tsx
│       ├── SemaforoIndicator.tsx
│       └── ChartWrapper.tsx
├── data/
│   └── mockData.ts
├── hooks/
│   └── useFilters.ts
└── types/
    └── creditRisk.ts
```

---

## 7. Prompt para generar el dashboard (para usar con Claude / Cursor / v0)

> Usar este prompt directamente en Claude Code, v0.dev o Cursor para generar el dashboard completo.

---

```
Eres un desarrollador frontend senior especializado en dashboards financieros y analítica de riesgo crediticio. Crea un dashboard completo en React + TypeScript + Tailwind CSS con estética dark profesional (como si lo hubiera diseñado un UX designer senior de Figma), que simule la herramienta de trabajo de un Analista de Inteligencia Crediticia Senior en un banco.

## CONTEXTO DEL ROL
El analista monitorea la cartera crediticia de individuos, evalúa calidad de riesgo, analiza el ciclo de vida del cliente y genera insights para políticas de crédito. Sus métricas principales son: mora, vintage, roll rates, netflow, IS-WAS, rentabilidad, y apetito de riesgo.

## DISEÑO / ESTÉTICA
- Fondo general: #0F1629 (azul marino oscuro)
- Cards/panels: #1A2744 con border sutil #2A3F6A
- Texto primario: #F1F5F9, secundario: #94A3B8
- Acentos: azul eléctrico #3B82F6, cyan #06B6D4, violeta #8B5CF6
- Alertas: rojo #EF4444, amarillo #F59E0B, verde #10B981
- Tipografía: 'Inter' para texto, 'JetBrains Mono' para números y métricas
- Gráficos con gradientes suaves, tooltips elegantes, animaciones de entrada
- Layout: sidebar izquierda (240px) + header (64px) + contenido principal scrollable
- Cards con hover:scale-[1.01] y shadow-lg subtle
- Estilo glassmorphism sutil en modales y tooltips

## MÓDULOS A IMPLEMENTAR (todos en una SPA con navegación sidebar)

### 1. EXECUTIVE SUMMARY (pantalla principal/home)
- 6 KPI cards horizontales en la parte superior:
  - Cartera Total: $4,850M (+3.2% MoM) → azul
  - Mora 30+ días: 3.8% (+0.2pp) → amarillo
  - NPL 90+ días: 1.9% (-0.1pp) → verde
  - Clientes Activos: 182,400 (+1.1%) → cyan
  - Tasa Aprobación: 62.4% (-1.8pp) → azul
  - Rentabilidad: 18.2% (+0.5pp) → violeta
- Sparkline inline en cada card (últimos 6 meses)
- Semáforo RAG (colored dot) según umbral de política
- Debajo: 3 charts en grid:
  - Evolución mensual de mora 30+ y 90+ (área chart, últimos 12 meses)
  - Distribución de cartera por producto (donut chart)
  - Top alertas del período (lista con íconos de severidad)

### 2. CALIDAD DE CARTERA (5 sub-secciones con tabs internos)

#### Tab 1: Mora por Bucket
- Stacked bar chart mensual con buckets: Al día / 1-30d / 31-60d / 61-90d / 91-180d / 180+
- Valores: Al día 83.5%, 1-30d 4.8%, 31-60d 3.1%, 61-90d 2.6%, 91-180d 3.2%, 180+ 2.8%
- Tabla detalle debajo con variación MoM y YoY
- Toggle por producto (Tarjeta, Préstamo Personal, Hipotecario, Automotriz)

#### Tab 2: Análisis Vintage
- Heatmap de cosechas (filas=mes de originación, columnas=mes de vida M3/M6/M9/M12/M18/M24)
- Escala de color: verde (mora baja) → amarillo → rojo (mora alta)
- Datos: Ene-2024 → M3:0.4%, M6:1.1%, M9:2.3%, M12:3.8%, M18:5.1%, M24:6.2%
         Feb-2024 → M3:0.3%, M6:1.0%, M9:2.1%, M12:3.5%, M18:4.9%
         Mar-2024 → M3:0.5%, M6:1.3%, M9:2.5%, M12:4.0%
         Abr-2024 → M3:0.4%, M6:1.2%, M9:2.4%
         May-2024 → M3:0.5%, M6:1.4%
         Jun-2024 → M3:0.3%
- Panel lateral: curvas de vintage superpuestas (line chart)
- Benchmark de cosecha "normal" como línea de referencia punteada

#### Tab 3: Roll Rates
- Matriz de transición 7x7 renderizada como heatmap
- Verde oscuro = alta tasa de cura (mejoría), rojo = alta tasa de deterioro
- Valores principales:
  Al día→Al día: 93.2%, Al día→1-30d: 5.1%
  1-30d→Al día: 68.4%, 1-30d→1-30d: 18.2%, 1-30d→31-60d: 9.3%
  31-60d→Al día: 24.1%, 31-60d→31-60d: 28.4%, 31-60d→61-90d: 18.9%
  61-90d→Al día: 8.2%, 61-90d→90+: 25.4%
- Tooltip en hover muestra el valor exacto y tendencia vs mes anterior
- Indicadores de "cura rate" y "roll forward rate" como KPIs resumidos debajo

#### Tab 4: Netflow
- Waterfall chart mensual (12 meses) mostrando:
  Entradas en mora (barra roja hacia arriba)
  Curas (barra verde hacia abajo)
  Castigos (barra gris hacia abajo)
  Netflow resultante (punto/línea)
- Datos Ene: +$12.4M entradas, -$8.1M curas, -$2.2M castigos = +$2.1M neto
        Feb: +$11.8M, -$9.3M, -$2.0M = +$0.5M neto
        Mar: +$13.2M, -$7.9M, -$2.4M = +$2.9M neto
        Abr: +$10.5M, -$10.1M, -$2.1M = -$1.7M neto
        May: +$11.2M, -$9.8M, -$2.0M = -$0.6M neto
        Jun: +$12.8M, -$8.4M, -$2.3M = +$2.1M neto
        Jul: +$11.5M, -$9.1M, -$2.2M = +$0.2M neto
- Línea acumulada secundaria
- Alerta visual si netflow positivo >2 meses consecutivos

#### Tab 5: IS-WAS
- 4 gauge charts (uno por segmento Score A/B/C/D)
- Aguja apunta al ratio IS/WAS actual
- Verde si <1.05, Amarillo si 1.05-1.20, Rojo si >1.20
- Valores: Score A: 0.80 ✅, Score B: 1.09 ⚠️, Score C: 1.16 ⚠️, Score D: 1.12 ⚠️
- Tabla detalle: Mora IS (actual) vs Mora WAS (esperada)
- Gráfico de líneas mostrando evolución del ratio IS/WAS en 12 meses

### 3. CICLO DE VIDA DEL CLIENTE
- Funnel vertical con 8 etapas y flechas de conversión
- Cada etapa: nombre, cantidad de clientes, tasa de conversión, color por salud
- Etapas y datos:
  Leads/Solicitudes: 48,200 clientes — (entry point)
  Aprobados: 30,060 — tasa 62.4% (benchmark 65%) ⚠️
  Activados 30d: 22,845 — tasa 76.0% (benchmark 72%) ✅
  Uso Activo 90d: 18,276 — tasa 80.0% (benchmark 75%) ✅
  Cross-sell exitoso: 5,483 — tasa 30.0% — ingreso incremental +$2.1M/mes
  Up-sell exitoso: 2,741 — tasa 15.0% — ingreso incremental +$1.2M/mes
  En Gestión Mora: 1,827 — mora activa
  Recuperados: 912 — tasa recupero 49.9% — recupero $0.8M
- Panel derecho: métricas complementarias
  Tiempo promedio aprobación: 2.3 días
  Churn 90d post-activación: 12.4%
  Contactabilidad en gestión: 58%
  LTV promedio cliente activo: $284,000
- Line chart: evolución de tasas de conversión en cada etapa (últimos 6 meses)

### 4. APETITO DE RIESGO
- Grid 4x2 de cards semáforo RAG
- Cada card: nombre del indicador, valor actual, límite de política, gauge semicircular, trend 3M
- Indicadores:
  NPL 90+: actual 1.9% / límite 2.5% → VERDE
  Mora 30+: actual 3.8% / límite 5.0% → VERDE
  Concentración Top 10: actual 11.2% / límite 15% → VERDE
  Roll Rate C→D: actual 31.2% / límite 30% → ROJO ❗
  Coverage Ratio: actual 118% / mínimo 120% → ROJO ❗
  Netflow Mensual: actual +$0.5M / objetivo ≤$0 → AMARILLO
  Tasa Aprobación: actual 62.4% / rango 45-70% → VERDE
  IS/WAS Score C: actual 1.16 / límite 1.20 → AMARILLO
- Panel inferior: tabla histórica 6 meses de cada indicador
- Botón "Exportar Reporte de Apetito de Riesgo" (simula export)

### 5. RENTABILIDAD
- Tabla principal con 5 productos + Total:
  Tarjeta: Cartera $1,820M, NIM 28.4%, Spread 22.1%, Costo Riesgo 4.2%, Rentabilidad 17.9%
  Préstamo Personal: $1,450M, 24.6%, 18.3%, 5.8%, 12.5%
  Hipotecario: $980M, 8.2%, 4.1%, 0.8%, 3.3%
  Automotriz: $600M, 18.9%, 12.4%, 2.1%, 10.3%
  Total: $4,850M, 22.1%, 16.2%, 4.0%, 12.2%
- Bar chart agrupado: NIM vs Costo de Riesgo vs Rentabilidad por producto
- Treemap: tamaño de cartera por producto (coloreado por rentabilidad)
- Evolución mensual de ROA y NIM (12 meses, line chart con área)
- KPIs destacados: ROA 2.8%, ROE 18.4%, Eficiencia 48.2%

### 6. SEGMENTACIÓN
Dos sub-vistas en tabs:

#### Tab Score Crediticio
- Donut chart: distribución de cartera por score (A:32%, B:38%, C:22%, D:8%)
- Tabla: Score / %Cartera / %Mora / NIM / Rentabilidad Neta
- Scatter plot: Score promedio (eje X) vs Mora realizada (eje Y), burbuja=tamaño cartera
- Bar chart: NIM y Costo Riesgo por segmento de score

#### Tab Demografía
- Distribución por tramo edad:
  18-25: 12% clientes, mora 6.2%, ticket $45k
  26-35: 28% clientes, mora 3.8%, ticket $82k
  36-50: 38% clientes, mora 2.9%, ticket $124k
  51-65: 18% clientes, mora 2.4%, ticket $98k
  65+: 4% clientes, mora 1.8%, ticket $67k
- Grouped bar chart: mora y ticket por tramo etario
- Mapa de calor: mora por (tramo edad × score crediticio)

### 7. ALERTAS & INSIGHTS
- Panel de alertas estilo "feed" con timeline
- Cada alerta: timestamp, severidad (crítico/alerta/info/ok), descripción, métrica afectada, botón "Ver detalle"
- Alertas de ejemplo:
  🔴 Crítico — hoy — Roll Rate C→D supera límite de política (31.2% vs 30.0%)
  🔴 Crítico — hoy — Coverage Ratio por debajo de mínimo (118% vs 120%)
  ⚠️ Alerta — ayer — Netflow positivo 2 meses consecutivos en Score C
  ⚠️ Alerta — hace 3d — IS/WAS Score B supera 1.05 por tercer mes (1.09)
  🟡 Info — hace 5d — Vintage Feb-2024 mejora vs. cosecha equivalente 2023
  🟢 OK — hace 1sem — NPL 90+ por debajo del límite por 6 meses consecutivos
  🟢 OK — hace 1sem — Activación 30d supera benchmark histórico (76% vs 72%)
- Filtros: por severidad, por módulo, por período
- Contador de alertas críticas en el badge del sidebar

## NAVEGACIÓN (Sidebar)
Ítems con íconos:
- 🏠 Resumen Ejecutivo (home, default)
- 📊 Calidad de Cartera (con badge "2 alertas")
- 🔄 Ciclo de Vida del Cliente
- 🎯 Apetito de Riesgo (con badge "2 críticos")
- 💰 Rentabilidad
- 👥 Segmentación
- 🔔 Alertas & Insights (badge con contador)
Logo/nombre del dashboard arriba: "Credit Intelligence" con subtítulo "Risk Analytics Platform"
Avatar/perfil del analista abajo con nombre "Analista Sr." y área "Riesgos"

## FILTROS GLOBALES (Header bar)
- Dropdown: Período (Último mes / 3M / 6M / 12M / YTD) — default: Último mes
- Dropdown: Producto (Todos / Tarjeta / Préstamo Personal / Hipotecario / Automotriz)
- Dropdown: Segmento (Todos / Score A / Score B / Score C / Score D)
- Botón: "Actualizado hace 2 min" con refresh icon
- Botón: "Exportar" (simula descarga)

## DATOS
- Todos los datos son mock/estáticos, definidos en /src/data/mockData.ts
- Exportar como constantes TypeScript tipadas
- Los filtros de período/producto deben filtrar/transformar los datos en el frontend

## COMPONENTES REUTILIZABLES A CREAR
- KPICard (valor, label, variación, sparkline, semáforo, color)
- SemaforoGauge (valor actual, límite, orientación min/max)
- HeatmapCell (valor, escala de color, tooltip)
- AlertBadge (severidad, texto)
- MetricTable (columnas, filas, con colores condicionales)
- ChartContainer (título, subtítulo, filtros opcionales, children)
- FunnelStage (etapa, valor, tasa, color, benchmark)

## LIBRERÍAS
- recharts para todos los gráficos
- lucide-react para íconos
- tailwindcss para estilos (modo oscuro por defecto)
- clsx para conditional classes
- date-fns para fechas

## CALIDAD
- TypeScript strict, sin any
- Componentes menores de 150 líneas
- Datos completamente tipados en /types/creditRisk.ts
- Responsive: funciona en 1280px+
- Sin dependencias innecesarias

Genera el proyecto completo con todos los archivos necesarios para que funcione con `npm create vite@latest . -- --template react-ts && npm install && npm run dev`.
```

---

## 8. Criterios de aceptación

- [ ] Todos los 7 módulos renderizan con datos mock
- [ ] Los filtros globales afectan a todos los módulos
- [ ] Semáforo RAG funciona correctamente (verde/amarillo/rojo por umbral)
- [ ] Gráficos de vintage, roll rates y netflow son los más complejos y están completos
- [ ] Estética dark profesional aplicada consistentemente
- [ ] No hay errores de TypeScript
- [ ] El proyecto arranca con `npm run dev` sin configuración adicional
