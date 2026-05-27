import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { CostDistributionChart } from "@/components/dashboard/CostDistributionChart";
import { RecentContributions } from "@/components/dashboard/RecentContributions";
import { ContributeForm } from "@/components/ContributeForm";
import { Calculator, IndianRupee, TrendingUp, Tags } from "lucide-react";

export default function Index() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('cost_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching data:', error);
    else setItems(data || []);
  };

  useEffect(() => {
    fetchData();
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Derived Data
  const filteredItems = items.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    items.forEach(item => {
      const cat = item.category; 
      if (!stats[cat]) stats[cat] = { total: 0, count: 0 };
      stats[cat].total += Number(item.avg_price);
      stats[cat].count += 1;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count)
    })).sort((a, b) => b.value - a.value);
  }, [items]);

  const totalValue = categoryStats.reduce((acc, curr) => acc + curr.value, 0);
  const highestCategory = categoryStats.length > 0 ? categoryStats[0] : null;

  return (
    <DashboardLayout 
      isDarkMode={isDarkMode} 
      toggleTheme={toggleTheme}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Explore the cost of living in Bengaluru, India.</p>
        </div>

        {/* Top Row: Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Estimated Total Costs" 
            value={`₹${totalValue.toLocaleString()}`} 
            icon={<Calculator className="w-5 h-5" />} 
          />
          <StatCard 
            title="Highest Expense" 
            value={highestCategory ? highestCategory.name : 'N/A'} 
            icon={<TrendingUp className="w-5 h-5" />} 
            trend={highestCategory ? `₹${highestCategory.value}` : undefined}
            trendUp={false}
          />
          <StatCard 
            title="Total Data Points" 
            value={items.length} 
            icon={<Tags className="w-5 h-5" />} 
          />
          <StatCard 
            title="Avg Housing Cost" 
            value={`₹${categoryStats.find(c => c.name === 'Housing')?.value?.toLocaleString() || 0}`} 
            icon={<IndianRupee className="w-5 h-5" />} 
          />
        </div>

        {/* Middle Row: Charts & Form */}
        <div className="grid gap-6 lg:grid-cols-7">
          <div className="lg:col-span-4 h-full">
            <CostDistributionChart categoryStats={categoryStats} totalValue={totalValue} />
          </div>
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-xl p-6 h-full shadow-sm hover:border-primary/50 transition-colors">
              <h3 className="text-lg font-semibold mb-4">Contribute Data</h3>
              <p className="text-sm text-muted-foreground mb-6">Help the community by adding recent costs you've incurred in Bengaluru.</p>
              <ContributeForm onDataAdded={fetchData} />
            </div>
          </div>
        </div>

        {/* Bottom Row: Data Grid */}
        <div className="grid gap-6 md:grid-cols-1">
          <RecentContributions items={filteredItems} />
        </div>

      </div>
    </DashboardLayout>
  );
}