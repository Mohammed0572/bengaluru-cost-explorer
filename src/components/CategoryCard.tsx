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
        relative overflow-hidden cursor-pointer transition-all duration-500
        border-2 p-6 group
        ${isActive 
          ? 'border-primary bg-card shadow-[0_0_30px_hsl(var(--primary)/0.4)] scale-105' 
          : 'border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]'
        }
      `}
    >
      {/* Gradient background effect */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${gradientClass}
      `} />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-3">
        <div className={`
          p-4 rounded-full transition-all duration-500
          ${isActive 
            ? 'bg-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.5)]' 
            : 'bg-muted group-hover:bg-primary/10'
          }
        `}>
          <Icon className={`
            w-8 h-8 transition-all duration-500
            ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'}
          `} />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{count} items</p>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      )}
    </Card>
  );
};
