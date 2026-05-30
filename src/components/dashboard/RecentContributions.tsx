import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { List } from "lucide-react";

interface CostItem {
  id: string;
  item: string;
  category: string;
  avg_price?: number;
  amount?: number;
  unit?: string;
  area?: string;
  neighborhood?: string;
  created_at: string;
}

interface RecentContributionsProps {
  items: CostItem[];
}

export const RecentContributions = ({ items }: RecentContributionsProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-5 h-5 text-primary" /> Recent Contributions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
            <p>No items found.</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors group"
              >
                <div className="flex flex-col gap-1 mb-2 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                      {item.item || item.category}
                    </h4>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {item.category}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    Location: {item.area || item.neighborhood || "Bengaluru"}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 text-right">
                  <span className="text-lg font-bold text-foreground">
                    Rs.{item.avg_price ?? item.amount ?? 0}
                  </span>
                  <span className="text-sm text-muted-foreground">/ {item.unit || "month"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
