import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts'
import clsx from 'clsx'
import PageHeader from '@/components/shared/PageHeader'
import ChartContainer from '@/components/shared/ChartContainer'
import {
  modelList,
  modelDeciles,
  modelDecilesComportamiento,
  rocCurveAdmision,
  rocCurveComportamiento,
} from '@/data/mockData'
import type { ModelDecileRow, RocPoint } from '@/types/creditRisk'

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt1(v: number) { return v.toFixed(1) }
function fmt2(v: number) { return v.toFixed(2) }

function aucColor(auc: number) {
  if (auc >= 0.75) return '#10B981'
  if (auc >= 0.65) return '#F59E0B'
  return '#EF4444'
}

function tasaColor(v: number, global: number) {
  if (v <= global * 0.6) return 'text-signal-green'
  if (v <= global * 1.4) return 'text-signal-amber'
  return 'text-signal-red'
}

// ─── KS chart data ────────────────────────────────────────────────────────────

function buildKsData(deciles: ModelDecileRow[]) {
  const totalGoods = deciles.reduce((s, d) => s + d.casos * (1 - d.tasaMora / 100), 0)
  const totalBads = deciles.reduce((s, d) => s + d.casos * (d.tasaMora / 100), 0)
  let cumGoods = 0
  let cumBads = 0
  const pts = [{ pop: 0, bads: 0, goods: 0 }]
  for (const d of deciles) {
    const goods = d.casos * (1 - d.tasaMora / 100)
    const bads = d.casos * (d.tasaMora / 100)
    cumGoods += goods
    cumBads += bads
    pts.push({
      pop: d.decil * 10,
      bads: +(cumBads / totalBads * 100).toFixed(1),
      goods: +(cumGoods / totalGoods * 100).toFixed(1),
    })
  }
  return pts
}

// ─── sub-components ───────────────────────────────────────────────────────────

function MetricBadge({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-4 flex flex-col gap-1">
      <span className="text-text-muted text-xs font-medium">{label}</span>
      <span className="font-mono text-2xl font-bold text-text-primary tabular-nums">{value}</span>
      {sub && <span className="text-text-muted text-[10px]">{sub}</span>}
    </div>
  )
}

function AucGauge({ auc }: { auc: number }) {
  const pct = (auc - 0.5) / 0.5 * 100
  const color = aucColor(auc)
  const r = 44
  const circ = 2 * Math.PI * r
  const half = circ / 2
  const fill = half * Math.min(pct / 100, 1)
  return (
    <div className="card p-5 flex flex-col items-center gap-2">
      <span className="text-text-muted text-xs font-medium">AUC — ROC</span>
      <div className="relative" style={{ width: 110, height: 60 }}>
        <svg width="110" height="60" viewBox="0 0 110 60">
          {/* background arc */}
          <path
            d="M 10 55 A 45 45 0 0 1 100 55"
            fill="none" stroke="#2D3039" strokeWidth="10" strokeLinecap="round"
          />
          {/* value arc */}
          <path
            d="M 10 55 A 45 45 0 0 1 100 55"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${half}`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
          <text x="55" y="52" textAnchor="middle" fontSize="18" fontWeight="700" fill={color} fontFamily="monospace">
            {auc.toFixed(3)}
          </text>
        </svg>
      </div>
      <div className="flex gap-3 text-[10px] text-text-muted">
        <span>0.5 = random</span>
        <span style={{ color }}>
          {auc >= 0.75 ? '✓ Bueno' : auc >= 0.65 ? '~ Aceptable' : '✗ Débil'}
        </span>
        <span>1.0 = perfecto</span>
      </div>
    </div>
  )
}

function RocChart({ data, auc }: { data: RocPoint[]; auc: number }) {
  const color = aucColor(auc)
  return (
    <ChartContainer title="Curva ROC" subtitle="Sensibilidad vs (1 − Especificidad) por umbral de score">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="aucGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
          <XAxis dataKey="fpr" type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }}
            axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} label={{ value: 'FPR (%)', position: 'insideBottom', offset: -2, fill: '#64748B', fontSize: 9 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false}
            tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
            formatter={(v: number, name: string) => [`${v.toFixed(1)}%`, name === 'tpr' ? 'Sensibilidad (TPR)' : 'FPR']}
          />
          <ReferenceLine
            segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]}
            stroke="#64748B" strokeDasharray="4 4" strokeOpacity={0.5}
            label={{ value: 'Modelo aleatorio', fill: '#64748B', fontSize: 9, position: 'insideTopLeft' }}
          />
          <Area type="monotone" dataKey="tpr" stroke={color} strokeWidth={2} fill="url(#aucGrad)" dot={false} name="tpr" />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-text-muted text-[10px] mt-1 text-center">
        AUC = {auc.toFixed(3)} · Gini = {(2 * auc - 1).toFixed(3)}
      </p>
    </ChartContainer>
  )
}

function KsChart({ deciles }: { deciles: ModelDecileRow[] }) {
  const data = buildKsData(deciles)
  const maxKs = Math.max(...data.map(d => Math.abs(d.bads - d.goods)))
  const ksPoint = data.find(d => Math.abs(d.bads - d.goods) === maxKs)
  return (
    <ChartContainer title="Curva KS" subtitle="% acumulado de morosos vs no morosos por decil de score">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3A3D44" strokeOpacity={0.5} vertical={false} />
          <XAxis dataKey="pop" type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }}
            axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false}
            tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={{ background: '#26282D', border: '1px solid #3A3D44', borderRadius: '8px', fontSize: '11px', color: '#F1F5F9' }}
            formatter={(v: number, name: string) => [`${v.toFixed(1)}%`, name === 'bads' ? '% Morosos acum.' : '% No morosos acum.']}
          />
          {ksPoint && (
            <ReferenceLine x={ksPoint.pop} stroke="#F59E0B" strokeDasharray="4 3" strokeOpacity={0.6}
              label={{ value: `KS=${fmt1(maxKs)}%`, fill: '#F59E0B', fontSize: 9, position: 'top' }} />
          )}
          <Line type="monotone" dataKey="bads" stroke="#EF4444" strokeWidth={2} dot={false} name="bads" />
          <Line type="monotone" dataKey="goods" stroke="#10B981" strokeWidth={2} dot={false} name="goods" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-1 justify-center text-[10px]">
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-signal-red inline-block" />% Morosos acum.</span>
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-signal-green inline-block" />% No morosos acum.</span>
      </div>
    </ChartContainer>
  )
}

function DecileTable({ deciles, tasaGlobal }: { deciles: ModelDecileRow[]; tasaGlobal: number }) {
  return (
    <ChartContainer
      title="Tabla de Performance por Decil de Score"
      subtitle="Ordenado de menor a mayor riesgo (D1 = mejor score)"
      minHeight={0}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border-subtle/50">
              <th className="text-center text-text-muted font-semibold py-2.5 px-2 text-[11px]">Decil</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">Score Inf.</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">Score Sup.</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">Casos</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">Frecuencia</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">% Morosos</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">% Morosos Acum.</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">Tasa Morosidad</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">Tasa Mora Acum.</th>
              <th className="text-right text-text-muted font-semibold py-2.5 px-2 text-[11px]">Lift</th>
            </tr>
          </thead>
          <tbody>
            {deciles.map((d, i) => {
              const isKs = d.pctMorososAcum - d.decil * 10 === Math.max(
                ...deciles.map(r => r.pctMorososAcum - r.decil * 10)
              )
              return (
                <tr
                  key={d.decil}
                  className={clsx(
                    'border-b border-border-subtle/20 transition-colors',
                    isKs ? 'bg-signal-amber/5' : i % 2 === 0 ? 'hover:bg-bg-elevated/20' : 'bg-bg-elevated/5 hover:bg-bg-elevated/20'
                  )}
                >
                  <td className="py-2 px-2 text-center">
                    <span className={clsx(
                      'inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold',
                      d.decil <= 3 ? 'bg-signal-green/20 text-signal-green' :
                      d.decil <= 6 ? 'bg-signal-amber/20 text-signal-amber' :
                      'bg-signal-red/20 text-signal-red'
                    )}>
                      {d.decil}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-text-secondary">{d.scoreInf}</td>
                  <td className="py-2 px-2 text-right font-mono text-text-secondary">{d.scoreSup}</td>
                  <td className="py-2 px-2 text-right font-mono text-text-primary">{d.casos.toLocaleString()}</td>
                  <td className="py-2 px-2 text-right font-mono text-text-primary">{fmt1(d.frecuencia)}%</td>
                  <td className="py-2 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className={clsx('h-full rounded-full', d.decil <= 3 ? 'bg-signal-green' : d.decil <= 6 ? 'bg-signal-amber' : 'bg-signal-red')}
                          style={{ width: `${(d.pctMorosos / 24) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-text-primary tabular-nums w-8 text-right">{fmt1(d.pctMorosos)}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-accent-blue rounded-full" style={{ width: `${d.pctMorososAcum}%` }} />
                      </div>
                      <span className={clsx('font-mono font-semibold tabular-nums w-10 text-right', d.pctMorososAcum === 100 ? 'text-accent-blue' : 'text-text-primary')}>
                        {fmt1(d.pctMorososAcum)}%
                      </span>
                    </div>
                  </td>
                  <td className={clsx('py-2 px-2 text-right font-mono font-semibold tabular-nums', tasaColor(d.tasaMora, tasaGlobal))}>
                    {fmt2(d.tasaMora)}%
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-text-secondary tabular-nums">{fmt2(d.tasaMoraAcum)}%</td>
                  <td className="py-2 px-2 text-right">
                    <span className={clsx('font-mono font-semibold tabular-nums', d.lift >= 1.5 ? 'text-signal-red' : d.lift >= 1.0 ? 'text-signal-amber' : 'text-signal-green')}>
                      {fmt2(d.lift)}x
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border-subtle bg-bg-elevated/30">
              <td colSpan={3} className="py-2.5 px-2 text-text-muted font-semibold text-[11px]">Total</td>
              <td className="py-2.5 px-2 text-right font-mono font-semibold text-text-primary">
                {deciles.reduce((s, d) => s + d.casos, 0).toLocaleString()}
              </td>
              <td className="py-2.5 px-2 text-right font-mono font-semibold text-text-primary">100.0%</td>
              <td className="py-2.5 px-2 text-right font-mono font-semibold text-text-primary">100.0%</td>
              <td className="py-2.5 px-2 text-right font-mono font-semibold text-accent-blue">100.0%</td>
              <td className="py-2.5 px-2 text-right font-mono font-semibold text-text-primary">{fmt2(tasaGlobal)}%</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-text-muted text-[10px] mt-2">
        La columna <span className="text-signal-amber font-semibold">% Morosos Acum.</span> acumula el porcentaje de morosos capturados desde D1. Llega al 100% en D10.
        El <span className="text-text-primary font-semibold">Lift</span> mide cuántas veces más morosos captura el modelo vs. selección aleatoria.
      </p>
    </ChartContainer>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Modelos() {
  const [selectedId, setSelectedId] = useState(modelList[0].id)
  const model = modelList.find(m => m.id === selectedId) ?? modelList[0]
  const deciles = model.id === 'scoring_admision' ? modelDeciles : modelDecilesComportamiento
  const rocData = model.id === 'scoring_admision' ? rocCurveAdmision : rocCurveComportamiento

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Modelos de Scoring"
        subtitle="Validación de performance, curvas ROC/KS y tabla de discriminación por decil"
      />

      {/* Model selector */}
      <div className="flex items-center gap-2 bg-bg-card rounded-xl border border-border-subtle p-1 w-fit">
        {modelList.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedId(m.id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
              selectedId === m.id
                ? 'bg-accent-blue text-white shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            )}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Model info bar */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-xs text-text-muted">
        <span><span className="text-text-secondary font-medium">Algoritmo:</span> {model.tipo}</span>
        <span className="w-px h-3 bg-border-subtle" />
        <span><span className="text-text-secondary font-medium">Fecha corte:</span> {model.fecha}</span>
        <span className="w-px h-3 bg-border-subtle" />
        <span><span className="text-text-secondary font-medium">Muestra:</span> {model.totalCasos.toLocaleString()} casos</span>
        <span className="w-px h-3 bg-border-subtle" />
        <span><span className="text-text-secondary font-medium">Morosos:</span> {model.totalMorosos.toLocaleString()} ({model.tasaMoraGlobal.toFixed(1)}%)</span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <AucGauge auc={model.auc} />
        </div>
        <MetricBadge
          label="Gini"
          value={model.gini.toFixed(3)}
          sub={`= 2×AUC − 1. Bueno ≥ 0.40`}
        />
        <MetricBadge
          label="KS Statistic"
          value={`${model.ks.toFixed(1)}%`}
          sub={`Máx. separación en D${model.ksDecil}`}
        />
        <MetricBadge
          label="Total Casos"
          value={model.totalCasos.toLocaleString()}
          sub="Muestra de validación"
        />
        <MetricBadge
          label="Tasa Mora Global"
          value={`${model.tasaMoraGlobal.toFixed(1)}%`}
          sub={`${model.totalMorosos.toLocaleString()} morosos`}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RocChart data={rocData} auc={model.auc} />
        <KsChart deciles={deciles} />
      </div>

      {/* Decile table */}
      <DecileTable deciles={deciles} tasaGlobal={model.tasaMoraGlobal} />
    </div>
  )
}
