import type { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
  minHeight?: number
}

export default function ChartContainer({ title, subtitle, children, className, headerRight, minHeight = 280 }: Props) {
  return (
    <div className={clsx('card card-hover animate-fade-in flex flex-col', className)}>
      <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-border-subtle/50">
        <div>
          <h3 className="text-text-primary font-semibold text-sm leading-tight">{title}</h3>
          {subtitle && <p className="text-text-muted text-[11px] mt-0.5">{subtitle}</p>}
        </div>
        {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
      </div>
      <div className="flex-1 p-4" style={{ minHeight }}>
        {children}
      </div>
    </div>
  )
}
