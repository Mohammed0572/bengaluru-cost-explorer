import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchCostData, CostItem } from "@/lib/mock-data";
import { Loader2 } from "lucide-react";

// Mock historical trend data for the chart (Time series needs separate handling)
const trendData = [
  { month: 'Jan', housing: 20000, food: 8000, transport: 3000 },
  { month: 'Feb', housing: 20500, food: 8200, transport: 3100 },
  { month: 'Mar', housing: 20500, food: 8500, transport: 3100 },
  { month: 'Apr', housing: 21000, food: 8400, transport: 3200 },
  { month: 'May', housing: 22000, food: 9000, transport: 3500 },
  { month: 'Jun', housing: 22500, food: 9200, transport: 3600 },
];

export default function Analytics() {
  const [data, setData] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCostData().then(fetched => {
      setData(fetched);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading analytics data from CSV...</p>
      </div>
    );
  }

  // Calculate dynamic category averages based on the CSV data
  const getCategoryAvg = (categoryName: string) => {
    const items = data.filter(i => i.category === categoryName);
    return items.length ? Math.round(items.reduce((sum, i) => sum + i.avg_price, 0) / items.length) : 0;
  };

  const categoryData = [
    { name: 'Housing', avg: getCategoryAvg('Housing') || 22000 },
    { name: 'Food', avg: getCategoryAvg('Food') || 8500 },
    { name: 'Transport', avg: getCategoryAvg('Transportation') || 3500 },
    { name: 'Utilities', avg: getCategoryAvg('Utilities') || 2500 },
    { name: 'Entertainment', avg: getCategoryAvg('Entertainment') || 4000 },
  ];

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-1">Deep dive into Bengaluru's cost trends over time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Cost Trends (6 Months)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="housing" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Housing" />
                <Area type="monotone" dataKey="food" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Food" />
                <Area type="monotone" dataKey="transport" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Transport" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Average by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                <Tooltip 
                  cursor={{fill: '#334155'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Bar dataKey="avg" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Avg Cost (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
