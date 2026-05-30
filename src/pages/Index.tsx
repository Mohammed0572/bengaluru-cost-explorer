import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { CostDistributionChart } from "@/components/dashboard/CostDistributionChart";
import { RecentContributions } from "@/components/dashboard/RecentContributions";
import { ContributeForm } from "@/components/ContributeForm";
<<<<<<< Updated upstream
import { Calculator, IndianRupee, TrendingUp, Tags } from "lucide-react";
=======
import { NeighborhoodSelector } from "@/components/dashboard/NeighborhoodSelector";
import { Calculator, IndianRupee, TrendingUp, Tags, Loader2, X, Move } from "lucide-react";
import { fetchCostData, CostItem } from "@/lib/mock-data";
import type { DashboardContextType } from "@/components/layout/DashboardLayout";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import type { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
      </div>
    </DashboardLayout>
=======
      {/* Top Row: Stat Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          title="Filtered Data Points" 
          value={filteredItems.length} 
          icon={<Tags className="w-5 h-5" />} 
        />
        <StatCard 
          title="Avg Housing Cost" 
          value={`₹${categoryStats.find(c => c.name === 'Housing')?.value?.toLocaleString() || 0}`} 
          icon={<IndianRupee className="w-5 h-5" />} 
        />
      </motion.div>

      {/* Active Filter Badge */}
      {selectedCategory && (
        <motion.div 
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center gap-1.5 bg-primary/15 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/25 transition-colors"
          >
            {selectedCategory}
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Draggable Dashboard Grid */}
      <motion.div variants={itemVariants} className="w-full">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          isResizable={true}
          margin={[24, 24]}
        >
          {/* Chart Widget */}
          <div key="chart" className="bg-card border rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="drag-handle p-2 border-b bg-muted/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors">
              <Move className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 flex-1 overflow-auto">
              {filteredItems.length > 0 ? (
                <CostDistributionChart categoryStats={categoryStats} totalValue={totalValue} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <IndianRupee className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No Data for this Area</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Widget */}
          <div key="form" className="bg-card border rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="drag-handle p-2 border-b bg-muted/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors">
              <Move className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-6 flex-1 overflow-auto">
              <h3 className="text-lg font-semibold mb-2">Contribute Data</h3>
              <p className="text-xs text-muted-foreground mb-4">Add recent costs you've incurred.</p>
              <ContributeForm onDataAdded={handleDataAdded} />
            </div>
          </div>



          {/* Data Grid Widget */}
          <div key="grid" className="bg-card border rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="drag-handle p-2 border-b bg-muted/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted/50 transition-colors">
              <Move className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-0 flex-1 overflow-auto">
              <RecentContributions items={
                selectedCategory 
                  ? filteredItems.filter(item => item.category === selectedCategory)
                  : filteredItems
              } />
            </div>
          </div>
        </ResponsiveGridLayout>
      </motion.div>
    </motion.div>
>>>>>>> Stashed changes
  );
}