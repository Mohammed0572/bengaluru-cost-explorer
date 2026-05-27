import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";

interface CategoryStat {
  name: string;
  value: number;
}

interface CostDistributionChartProps {
  categoryStats: CategoryStat[];
  totalValue: number;
}

const COLORS = ['#10b981', '#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
const BG_COLORS = ['bg-emerald-500', 'bg-teal-600', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-pink-500'];

export const CostDistributionChart = ({ categoryStats, totalValue }: CostDistributionChartProps) => {
  
  let currentAngle = 0;
  const pieGradient = categoryStats.length > 0 
    ? categoryStats.map((stat, index) => {
        const percentage = (stat.value / totalValue) * 100;
        const color = COLORS[index % COLORS.length];
        const start = currentAngle;
        currentAngle += percentage;
        return `${color} ${start}% ${currentAngle}%`;
      }).join(', ')
    : '#334155 0% 100%';

  return (
    <Card className="h-full hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <PieChartIcon className="w-5 h-5" /> Cost Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
        <div 
          className="w-48 h-48 rounded-full shrink-0 relative shadow-lg hover:scale-105 transition-transform duration-500"
          style={{ background: `conic-gradient(${pieGradient})` }}
        >
          <div className="absolute inset-0 m-auto w-32 h-32 rounded-full flex flex-col items-center justify-center bg-card shadow-inner">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
            <span className="text-lg font-bold">₹{totalValue.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="space-y-3 text-sm w-full sm:w-auto">
          {categoryStats.length === 0 ? (
            <p className="text-muted-foreground text-center">No data available</p>
          ) : (
            categoryStats.map((stat, index) => (
              <div key={stat.name} className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${BG_COLORS[index % BG_COLORS.length]}`}></div>
                  <span className="text-muted-foreground font-medium">{stat.name}</span>
                </div>
                <span className="font-semibold text-foreground">
                  {Math.round((stat.value / totalValue) * 100)}%
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
