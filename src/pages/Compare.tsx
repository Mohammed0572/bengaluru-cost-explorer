import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCostData, CostItem } from "@/lib/mock-data";
import { Loader2 } from "lucide-react";

const Compare = () => {
  const [data, setData] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");

  useEffect(() => {
    fetchCostData().then(fetched => {
      setData(fetched);
      const uniqueAreas = [...new Set(fetched.map(item => item.area))];
      setArea1(uniqueAreas[0] || "");
      setArea2(uniqueAreas[1] || "");
      setLoading(false);
    });
  }, []);

  const neighborhoods = [...new Set(data.map(item => item.area))];

  const getAverages = (areaName: string) => {
    const areaData = data.filter(item => item.area === areaName);
    const getAvg = (cat: string) => {
      const items = areaData.filter(i => i.category === cat);
      return items.length ? Math.round(items.reduce((sum, i) => sum + i.avg_price, 0) / items.length) : 0;
    };
    return {
      Rent: getAvg("Housing"),
      Food: getAvg("Food"),
      Transport: getAvg("Transportation"),
    };
  };

  const avg1 = getAverages(area1);
  const avg2 = getAverages(area2);

  const comparisonData = [
    {
      category: "Rent (1BHK)",
      [area1]: avg1.Rent,
      [area2]: avg2.Rent,
    },
    {
      category: "Food",
      [area1]: avg1.Food,
      [area2]: avg2.Food,
    },
    {
      category: "Transport",
      [area1]: avg1.Transport,
      [area2]: avg2.Transport,
    }
  ];

  if (loading) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading comparison data from CSV...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">Compare Neighborhoods</h1>
        <p className="text-muted-foreground">Select two areas to compare living costs side-by-side.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Area 1</label>
          <Select value={area1} onValueChange={setArea1}>
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder="Select Area 1" />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map(n => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Area 2</label>
          <Select value={area2} onValueChange={setArea2}>
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder="Select Area 2" />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map(n => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Cost Comparison</CardTitle>
            <CardDescription>{area1} vs {area2}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                  />
                  <Legend />
                  <Bar dataKey={area1} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={area2} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Compare;
