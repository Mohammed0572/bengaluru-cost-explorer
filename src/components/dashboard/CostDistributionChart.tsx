import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryStat {
  name: string;
  value: number;
}

interface CostDistributionChartProps {
  categoryStats: CategoryStat[];
  totalValue: number;
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];

export const CostDistributionChart = ({ categoryStats, totalValue }: CostDistributionChartProps) => {
  return (
    <div className="flex h-full min-h-[280px] flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Cost Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Total estimated average: Rs.{totalValue.toLocaleString("en-IN")}
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryStats}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
            >
              {categoryStats.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`Rs.${value.toLocaleString("en-IN")}`, "Average"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
