import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export const StatCard = ({ title, value, icon, trend, trendUp, className }: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden group hover:border-border hover:bg-muted/30 transition-all duration-300 ease-out hover:-translate-y-1 shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-300 ease-out">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
