import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AreaSelectorProps {
  areas: string[];
  selectedArea: string;
  onAreaChange: (area: string) => void;
}

export const AreaSelector = ({ areas, selectedArea, onAreaChange }: AreaSelectorProps) => {
  return (
    <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-all duration-300">
      <MapPin className="w-5 h-5 text-primary" />
      <Select value={selectedArea} onValueChange={onAreaChange}>
        <SelectTrigger className="w-[200px] border-0 focus:ring-0 focus:ring-offset-0 bg-transparent">
          <SelectValue placeholder="Select Area" />
        </SelectTrigger>
        <SelectContent>
          {areas.map((area) => (
            <SelectItem key={area} value={area}>
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
