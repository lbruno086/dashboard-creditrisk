import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  RefreshCw,
  Target,
  DollarSign,
  Users,
  Bell,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react'
import clsx from 'clsx'
import { alerts } from '@/data/mockData'

const criticoCount = alerts.filter(a => a.severity === 'critico').length
const alertaCount = alerts.filter(a => a.severity === 'alerta').length

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Resumen Ejecutivo', exact: true },
  { to: '/calidad-cartera', icon: BarChart3, label: 'Calidad de Cartera', badge: alertaCount, badgeColor: 'amber' },
  { to: '/ciclo-vida', icon: RefreshCw, label: 'Ciclo de Vida' },
  { to: '/limites-riesgo', icon: Target, label: 'Límites de Riesgo', badge: criticoCount, badgeColor: 'red' },
  { to: '/rentabilidad', icon: DollarSign, label: 'Rentabilidad' },
  { to: '/segmentacion', icon: Users, label: 'Segmentacion' },
  { to: '/alertas', icon: Bell, label: 'Alertas & Insights', badge: criticoCount + alertaCount, badgeColor: 'amber' },
] as const

function ICBCLogo({ collapsed }: { collapsed: boolean }) {
  const logoSrc = `${import.meta.env.BASE_URL}brand/icbc-logo.svg`
  if (collapsed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 p-1.5 shadow-sm">
        <img src={logoSrc} alt="ICBC" className="h-auto w-full object-contain" />
      </div>
    )
  }
  return (
    <div className="flex min-w-0 items-center gap-3 px-1">
      <div className="flex h-8 w-[88px] flex-shrink-0 items-center justify-center rounded-md bg-white/95 px-2 py-1 shadow-sm">
        <img src={logoSrc} alt="ICBC Argentina" className="h-full w-auto object-contain" />
      </div>
      <div className="min-w-0 border-l border-border-subtle pl-3">
        <div className="max-w-[142px] truncate text-sm font-semibold leading-tight text-text-primary">Credit Intelligence</div>
        <div className="max-w-[142px] truncate text-[10px] leading-tight text-text-muted">Risk Analytics Platform</div>
      </div>
    </div>
  )
}

type BadgeColor = 'amber' | 'red'

function Badge({ count, color }: { count: number; color: BadgeColor }) {
  if (!count) return null
  return (
    <span
      className={clsx(
        'ml-auto flex-shrink-0 text-[10px] font-bold font-mono rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none',
        color === 'red'
          ? 'bg-signal-red/20 text-signal-red border border-signal-red/30'
          : 'bg-signal-amber/20 text-signal-amber border border-signal-amber/30'
      )}
    >
      {count}
    </span>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={clsx(
        'relative flex flex-col h-full bg-bg-card border-r border-border-subtle transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center h-16 border-b border-border-subtle', collapsed ? 'justify-center px-3' : 'px-4')}>
        <ICBCLogo collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'exact' in item ? item.exact : false}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 mx-2 my-0.5 rounded-lg transition-all duration-150 group',
                collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                isActive
                  ? 'bg-accent-blue/10 border border-accent-blue/20 text-text-primary'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={17}
                  className={clsx('flex-shrink-0', isActive ? 'text-accent-blue' : 'group-hover:text-accent-blue/70')}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
                    {'badge' in item && item.badge ? (
                      <Badge count={item.badge} color={item.badgeColor as BadgeColor} />
                    ) : null}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className={clsx('border-t border-border-subtle', collapsed ? 'p-2' : 'p-3')}>
        <div className={clsx('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-accent-blue" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-text-primary text-xs font-semibold truncate">Analista Sr.</div>
              <div className="text-text-muted text-[10px] truncate">Equipo de Riesgos</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-24 z-30 w-6 h-6 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary hover:border-accent-blue/40 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
