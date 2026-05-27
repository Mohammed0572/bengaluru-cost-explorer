import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const NEIGHBORHOODS = [
  "All Areas",
  "Indiranagar",
  "Koramangala",
  "Whitefield",
  "HSR Layout",
  "Malleswaram",
  "Jayanagar",
  "MG Road"
];

interface NeighborhoodSelectorProps {
  selectedArea: string;
  onSelectArea: (area: string) => void;
}

export const NeighborhoodSelector = ({ selectedArea, onSelectArea }: NeighborhoodSelectorProps) => {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Filter by Neighborhood</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {NEIGHBORHOODS.map((area) => (
          <Button
            key={area}
            variant={selectedArea === area ? "default" : "outline"}
            className="rounded-full transition-all duration-300"
            onClick={() => onSelectArea(area)}
          >
            {area}
          </Button>
        ))}
      </div>
    </div>
  );
};
