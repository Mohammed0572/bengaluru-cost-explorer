import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CostItemProps {
  item: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
}

export const CostItem = ({ item, minPrice, maxPrice, avgPrice, unit }: CostItemProps) => {
  const range = maxPrice - minPrice;
  const avgPosition = range > 0 ? ((avgPrice - minPrice) / range) * 100 : 50;

  return (
    <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] group">
      <div className="space-y-4">
        {/* Item name and average price */}
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {item}
          </h4>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">
              {avgPrice.toLocaleString()} {unit}
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
        </div>

        {/* Price range visualization */}
        <div className="space-y-2">
          <div className="relative">
            <Progress value={avgPosition} className="h-2" />
            <div 
              className="absolute top-0 h-2 w-1 bg-accent shadow-[0_0_10px_hsl(var(--accent))]"
              style={{ left: `${avgPosition}%` }}
            />
          </div>
          
          {/* Min and Max labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: ₹{minPrice.toLocaleString()}</span>
            <span>Max: ₹{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
