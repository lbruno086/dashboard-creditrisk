import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  render: (row: T) => ReactNode
  color?: (row: T) => string | undefined
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
}

export default function MetricTable<T>({ columns, data, keyExtractor }: Props<T>) {
  const alignClass = (align?: Column<T>['align']) => {
    if (align === 'right') return 'text-right'
    if (align === 'center') return 'text-center'
    return 'text-left'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border-subtle/50">
            {columns.map(col => (
              <th
                key={col.key}
                className={`${alignClass(col.align)} text-text-muted font-medium py-2 text-[11px]`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={keyExtractor(row)} className="border-b border-border-subtle/20 hover:bg-bg-elevated/20 transition-colors">
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`py-2 ${alignClass(col.align)} font-mono`}
                  style={col.color ? { color: col.color(row) } : undefined}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
