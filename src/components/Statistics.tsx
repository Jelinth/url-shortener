import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { ChartDataPoint } from "@/types/url";
import { formatShortDate } from "@/utils/formatDate";

interface StatisticsProps {
  data: ChartDataPoint[];
}

export default function Statistics({ data }: StatisticsProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatShortDate(d.date),
  }));

  return (
    <section className="bg-card border border-border rounded overflow-hidden">
      <div className="bg-table-header px-6 py-3 border-b border-border">
        <h3 className="font-semibold text-foreground">Statistics</h3>
      </div>
      <div className="p-6">
        <h4 className="text-center font-semibold text-sm mb-4 text-foreground">
          Recent Statistics of Click Counts
        </h4>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 18% 87%)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(210 18% 87%)",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey="clicks"
              name="URL Clicks"
              stroke="hsl(170 60% 50%)"
              fill="hsl(170 60% 50% / 0.2)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Bar
              dataKey="creations"
              name="URL Creations"
              fill="hsl(207 70% 45%)"
              barSize={20}
              radius={[2, 2, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
