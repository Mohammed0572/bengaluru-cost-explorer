import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

type CostItemInsert = {
  category: string;
  item: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  unit: string;
  area: string;
};

export const ContributeForm = ({ onDataAdded }: { onDataAdded: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    category: "",
    item: "",
    price: "",
    area: "",
    unit: "unit"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.item || !formData.price) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase is not configured",
        description: "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable submissions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const priceVal = Number(formData.price);

    try {
      // Insert the new row into Supabase
      const { error } = await supabase.from("cost_items").insert({
        category: formData.category,
        item: formData.item,
        min_price: priceVal,     
        max_price: priceVal,
        avg_price: priceVal,
        unit: formData.unit,
        area: formData.area || "Bengaluru",
      } as CostItemInsert);

      if (error) throw error;

      toast({ title: "Success!", description: "Thank you for contributing data." });
      setFormData({ category: "", item: "", price: "", area: "", unit: "unit" });
      onDataAdded(); // Refresh the main list

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to submit data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto border-dashed border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-primary" />
          Contribute Data
        </CardTitle>
        <CardDescription>
          Help improve our database by adding prices you know.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Area / Location</Label>
              <Input 
                placeholder="e.g. Indiranagar" 
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input 
              placeholder="e.g. Cold Coffee" 
              value={formData.item}
              onChange={(e) => setFormData({...formData, item: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input 
                placeholder="e.g. cup, month, kg" 
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit Contribution
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
