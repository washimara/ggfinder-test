import * as React from "react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

// Define the data structure for chart data
interface ChartData {
  name: string
  value: number
  color?: string
  [key: string]: any // Allow additional fields for flexibility
}

// Define the config structure (based on usage in the component)
interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
  }
}

const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
    data: ChartData[]
    type: "line" | "bar" | "pie"
    xAxisDataKey?: string
    yAxisDataKey?: string
  }
>(({ className, config, data, type, xAxisDataKey, yAxisDataKey, ...props }, ref) => {
  const renderLegend = (legendData: ChartData[]) => {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-4">
        {legendData.map((item: ChartData, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color || config[item.name]?.color || "#8884d8" }}
            />
            <span>{config[item.name]?.label || item.name}</span>
          </li>
        ))}
      </ul>
    )
  }

  const renderPieLabel = (pieData: ChartData[]) => {
    return pieData.map((item: ChartData) => ({
      ...item,
      fill: item.color || config[item.name]?.color || "#8884d8",
    }))
  }

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            {Object.keys(config).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={yAxisDataKey || key}
                stroke={config[key].color || "#8884d8"}
                strokeWidth={2}
              />
            ))}
            <XAxis dataKey={xAxisDataKey || "name"} />
            <YAxis />
            <Tooltip />
          </LineChart>
        )
      case "bar":
        return (
          <BarChart data={data}>
            {Object.keys(config).map((key) => (
              <Bar
                key={key}
                dataKey={yAxisDataKey || key}
                fill={config[key].color || "#8884d8"}
              />
            ))}
            <XAxis dataKey={xAxisDataKey || "name"} />
            <YAxis />
            <Tooltip />
          </BarChart>
        )
      case "pie":
        return (
          <PieChart>
            <Pie
              data={renderPieLabel(data)}
              dataKey={yAxisDataKey || "value"}
              nameKey={xAxisDataKey || "name"}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            />
            <Tooltip />
          </PieChart>
        )
      default:
        return null
    }
  }

  return (
    <div ref={ref} className={cn("w-full h-[300px]", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
      {type !== "pie" && renderLegend(data)}
    </div>
  )
})
Chart.displayName = "Chart"

export { Chart }
