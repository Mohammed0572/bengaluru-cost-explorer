import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard = ({ title, value, icon, trend, trendUp = true }: StatCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {trend ? (
              <p className={trendUp ? "text-sm text-emerald-600" : "text-sm text-muted-foreground"}>
                {trend}
              </p>
            ) : null}
          </div>
          <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};
