import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ClickEvent } from "@/types/url";
import { formatShortDate } from "@/utils/formatDate";

interface AnalyticsChartProps {
  clickEvents: ClickEvent[];
}

export default function AnalyticsChart({ clickEvents }: AnalyticsChartProps) {
  const dateMap = new Map<string, number>();
  clickEvents.forEach((e) => {
    const date = e.clickedAt.split("T")[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  const data = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, label: formatShortDate(date), clicks: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 18% 87%)" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0 0% 100%)",
            border: "1px solid hsl(210 18% 87%)",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="hsl(207 70% 45%)"
          strokeWidth={2}
          dot={{ r: 4, fill: "hsl(207 70% 45%)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
