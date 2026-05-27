import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  count: number;
  isActive: boolean;
  onClick: () => void;
  gradientClass: string;
}

export const CategoryCard = ({ 
  title, 
  icon: Icon, 
  count, 
  isActive, 
  onClick,
  gradientClass 
}: CategoryCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer transition-transform duration-300 ease-out
        border p-6 group rounded-lg
        ${isActive 
          ? 'border-primary bg-card shadow-sm -translate-y-1' 
          : 'border-border/50 bg-card/50 hover:border-primary/30 hover:shadow-sm hover:-translate-y-1'
        }
      `}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-3">
        <div className={`
          p-4 rounded-full transition-colors duration-300 ease-out
          ${isActive 
            ? 'bg-primary/20' 
            : 'bg-muted group-hover:bg-muted/80'
          }
        `}>
          <Icon className={`
            w-6 h-6 transition-colors duration-300
            ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}
          `} />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-base mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{count} items</p>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
      )}
    </Card>
  );
};
