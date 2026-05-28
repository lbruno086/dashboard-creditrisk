import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface Props {
  data: number[]
  color: string
  width?: number
  height?: number
}

export default function MiniSparkline({ data, color, width = 60, height = 28 }: Props) {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
