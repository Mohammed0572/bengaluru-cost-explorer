import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { fetchCostData, CostItem } from "@/lib/mock-data";
import { Loader2, Copy, MapPin, Home, Utensils, Car, Dumbbell, Film, Stethoscope, SlidersHorizontal, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const HOUSING_OPTIONS = ["PG Accommodation", "1BHK Rent", "2BHK Rent", "3BHK Rent"];
const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];

export default function LifestyleCalculator() {
  const { toast } = useToast();
  const [data, setData] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [area, setArea] = useState<string>("");
  const [housing, setHousing] = useState<string>("1BHK Rent");
  
  // Dials
  const [eatingOut, setEatingOut] = useState<number>(2); // 0-4
  const [transport, setTransport] = useState<number>(1); // 0-3
  const [fitness, setFitness] = useState<number>(1); // 0-2
  const [entertainment, setEntertainment] = useState<number>(1); // 0-3
  const [healthcare, setHealthcare] = useState<number>(0); // 0-1

  useEffect(() => {
    fetchCostData().then(fetched => {
      setData(fetched);
      const uniqueAreas = [...new Set(fetched.map(item => item.area))].filter(a => a !== "All Areas");
      if (uniqueAreas.length > 0) setArea(uniqueAreas[0]);
      setLoading(false);
    });
  }, []);

  const uniqueAreas = useMemo(() => {
    return [...new Set(data.map(item => item.area))].filter(a => a !== "All Areas");
  }, [data]);

  // Helper to find specific cost, falling back to city average if not found
  const getCost = (category: string, itemSearch: string, specificArea: string = area) => {
    if (!specificArea) return 0;
    
    // Exact match in area
    const exact = data.find(d => d.area === specificArea && d.category === category && d.item.includes(itemSearch));
    if (exact) return exact.avg_price;
    
    // Match in "All Areas"
    const allAreas = data.find(d => d.area === "All Areas" && d.category === category && d.item.includes(itemSearch));
    if (allAreas) return allAreas.avg_price;

    // City average fallback
    const matches = data.filter(d => d.category === category && d.item.includes(itemSearch));
    if (matches.length > 0) return matches.reduce((acc, curr) => acc + curr.avg_price, 0) / matches.length;

    return 0;
  };

  // Calculations
  const breakdown = useMemo(() => {
    if (!area) return [];

    // Housing + Utilities (Assume base utilities per house type)
    const baseRent = getCost("Housing", housing);
    const utilities = getCost("Utilities", "Electricity") + getCost("Utilities", "Internet") + getCost("Utilities", "Water");
    const totalHousing = baseRent + (housing === "PG Accommodation" ? 0 : utilities); // PG usually includes utilities

    // Food
    const groceries = getCost("Food", "Groceries");
    const diningMeal = getCost("Food", "Restaurant Meal") || 300;
    const diningCost = [0, 4, 8, 15, 30][eatingOut] * diningMeal; // meals per month
    const totalFood = groceries + diningCost;

    // Transport
    let totalTransport = 0;
    if (transport === 0) totalTransport = getCost("Transportation", "Metro"); // Metro
    else if (transport === 1) totalTransport = getCost("Transportation", "Auto") * 20; // Auto occasionally
    else if (transport === 2) totalTransport = getCost("Transportation", "Ola/Uber") * 20; // Cab occasionally
    else totalTransport = getCost("Transportation", "Petrol") * 40 + getCost("Transportation", "Bike"); // Own vehicle approx

    // Fitness
    let totalFitness = 0;
    if (fitness === 1) totalFitness = getCost("Fitness & Lifestyle", "Budget");
    else if (fitness === 2) totalFitness = getCost("Fitness & Lifestyle", "Premium");

    // Entertainment
    const movie = getCost("Entertainment", "Movie") || 300;
    const pub = getCost("Entertainment", "Pub") || 1500;
    const streaming = getCost("Entertainment", "Streaming") || 650;
    
    let totalEnt = streaming;
    if (entertainment === 1) totalEnt += movie * 2;
    if (entertainment === 2) totalEnt += movie * 2 + pub * 1;
    if (entertainment === 3) totalEnt += movie * 4 + pub * 4;

    // Healthcare
    let totalHealth = getCost("Healthcare", "Pharmacy") || 800;
    if (healthcare === 1) totalHealth += getCost("Healthcare", "Consultation") || 1000;

    return [
      { name: "Housing & Utilities", value: Math.round(totalHousing), icon: Home },
      { name: "Food & Dining", value: Math.round(totalFood), icon: Utensils },
      { name: "Transport", value: Math.round(totalTransport), icon: Car },
      { name: "Lifestyle & Fitness", value: Math.round(totalFitness + totalEnt), icon: Dumbbell },
      { name: "Healthcare", value: Math.round(totalHealth), icon: Stethoscope },
    ].filter(item => item.value > 0);
  }, [area, housing, eatingOut, transport, fitness, entertainment, healthcare, data]);

  const totalCost = breakdown.reduce((acc, curr) => acc + curr.value, 0);

  const copySummary = () => {
    const text = `My Bengaluru Lifestyle Budget in ${area}:\nTotal: ₹${totalCost.toLocaleString()}/month\n\nBreakdown:\n` + 
      breakdown.map(b => `- ${b.name}: ₹${b.value.toLocaleString()}`).join('\n');
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Summary copied to clipboard." });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading calculator data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <SlidersHorizontal className="w-10 h-10 text-primary" /> Lifestyle Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Build your personalized Bengaluru budget. Adjust the dials to see how your lifestyle choices impact your monthly expenses based on real market data.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* LEFT COLUMN: Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          {/* Section 1: Area */}
          <Card className="border-primary/20 shadow-sm bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> 1. Where do you want to live?</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select Neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueAreas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Section 2: Housing */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2"><Home className="w-5 h-5 text-primary" /> 2. Housing Preference</h3>
            <div className="grid grid-cols-2 gap-3">
              {HOUSING_OPTIONS.map(opt => {
                const cost = getCost("Housing", opt);
                const isSelected = housing === opt;
                return (
                  <div 
                    key={opt}
                    onClick={() => setHousing(opt)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="font-semibold">{opt}</div>
                    <div className="text-sm text-muted-foreground mt-1">~₹{Math.round(cost).toLocaleString()}/mo</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 3: Lifestyle Dials */}
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-bold flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-primary" /> 3. Adjust Your Dials</h3>
            
            {/* Eating Out */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2"><Utensils className="w-4 h-4"/> Dining Out</span>
                <span className="text-muted-foreground">{["Cook at home", "Weekends only", "Twice a week", "Every other day", "Daily delivery"][eatingOut]}</span>
              </div>
              <Slider value={[eatingOut]} max={4} step={1} onValueChange={(v) => setEatingOut(v[0])} />
            </div>

            {/* Transport */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2"><Car className="w-4 h-4"/> Transport</span>
                <span className="text-muted-foreground">{["Bus/Metro", "Occasional Auto", "Regular Cabs", "Own Vehicle"][transport]}</span>
              </div>
              <Slider value={[transport]} max={3} step={1} onValueChange={(v) => setTransport(v[0])} />
            </div>

            {/* Fitness */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2"><Dumbbell className="w-4 h-4"/> Fitness</span>
                <span className="text-muted-foreground">{["Home/Park", "Budget Gym", "Premium Club"][fitness]}</span>
              </div>
              <Slider value={[fitness]} max={2} step={1} onValueChange={(v) => setFitness(v[0])} />
            </div>

            {/* Entertainment */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2"><Film className="w-4 h-4"/> Entertainment</span>
                <span className="text-muted-foreground">{["Homebody", "Movies", "Movies + Pubs", "Social Butterfly"][entertainment]}</span>
              </div>
              <Slider value={[entertainment]} max={3} step={1} onValueChange={(v) => setEntertainment(v[0])} />
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-24"
        >
          <Card className="border-none shadow-xl bg-gradient-to-br from-card to-card/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <CardHeader className="text-center pb-2 relative z-10">
              <CardDescription className="uppercase tracking-wider font-bold">Estimated Monthly Cost</CardDescription>
              <CardTitle className="text-6xl font-black text-primary mt-2">
                ₹{totalCost.toLocaleString()}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-8 relative z-10 pt-6">
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {breakdown.map((item, i) => (
                  <div key={item.name} className="flex justify-between items-center p-3 rounded-lg bg-background/50 border">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold">₹{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <Button onClick={copySummary} className="w-full h-12 rounded-xl font-bold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform">
                <Copy className="w-4 h-4 mr-2" /> Copy Breakdown
              </Button>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
