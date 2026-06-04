import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { CostDistributionChart } from "@/components/dashboard/CostDistributionChart";
import { RecentContributions } from "@/components/dashboard/RecentContributions";
import { NeighborhoodSelector } from "@/components/dashboard/NeighborhoodSelector";
import { ContributeForm } from "@/components/ContributeForm";
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
export default function Index() {
  const [items, setItems] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { searchTerm } = useOutletContext<DashboardContextType>();

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCostData();
    setItems(data);
    setLoading(false);
  };

  // Draggable Layout State
  const defaultLayout: Layout[] = [
    { i: "chart", x: 0, y: 0, w: 7, h: 10, minW: 4, minH: 8 },
    { i: "form", x: 7, y: 0, w: 5, h: 10, minW: 4, minH: 8 },
    { i: "grid", x: 0, y: 10, w: 12, h: 12, minW: 6, minH: 10 },
  ];

  const [layouts, setLayouts] = useState<Record<string, Layout[]>>(() => {
    const saved = localStorage.getItem("dashboardLayout");
    if (!saved) {
      return { lg: defaultLayout };
    }

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed?.lg) ? parsed : { lg: defaultLayout };
    } catch {
      localStorage.removeItem("dashboardLayout");
      return { lg: defaultLayout };
    }
  });

  const onLayoutChange = (_layout: Layout[], allLayouts: Record<string, Layout[]>) => {
    setLayouts(allLayouts);
    localStorage.setItem("dashboardLayout", JSON.stringify(allLayouts));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDataAdded = () => {
    // Mocking adding data by refreshing the mock data set from CSV
    loadData();
  };

  // Derived Data
  const filteredItems = items.filter(item => {
    const itemName = item.item || "";
    const itemArea = item.area || "";
    const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "All Areas" || itemArea === selectedArea;
    return matchesSearch && matchesArea;
  });

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    filteredItems.forEach(item => {
      const cat = item.category; 
      if (!stats[cat]) stats[cat] = { total: 0, count: 0 };
      stats[cat].total += Number(item.avg_price || item.amount || 0);
      stats[cat].count += 1;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count)
    })).sort((a, b) => b.value - a.value);
  }, [filteredItems]);

  const totalValue = categoryStats.reduce((acc, curr) => acc + curr.value, 0);
  const highestCategory = categoryStats.length > 0 ? categoryStats[0] : null;

  if (loading) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading live data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl p-8 overflow-hidden shadow-xl animate-fade-in-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Real-Time Cost of Living in <span className="text-primary">Bengaluru</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            A crowdsourced database built to help you understand exact prices across Namma Bengaluru. From rent in Indiranagar to a Masala Dosa in Jayanagar.
          </p>
          <div className="flex gap-4">
            <div className="bg-background border rounded-lg px-4 py-2 flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Contributions</span>
              <span className="text-xl font-bold">{items.length} Data Points</span>
            </div>
            <div className="bg-background border rounded-lg px-4 py-2 flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Avg 1BHK Rent</span>
              <span className="text-xl font-bold text-primary">₹22,000/mo</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Neighborhood Selector */}
      <motion.div variants={itemVariants}>
        <NeighborhoodSelector selectedArea={selectedArea} onSelectArea={setSelectedArea} />
      </motion.div>

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
          cols={{ lg: 12, md: 10, sm: 6, xs: 1, xxs: 1 }}
          rowHeight={30}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          isResizable={true}
          margin={[24, 24]}
        >
          {/* Chart Widget */}
          <div key="chart" className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl shadow-lg flex flex-col h-full overflow-hidden hover:border-primary/40 transition-all duration-300">
            <div className="drag-handle p-2 border-b border-[var(--glass-border)] bg-muted/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted/40 transition-colors">
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
          <div key="form" className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl shadow-lg flex flex-col h-full overflow-hidden hover:border-primary/40 transition-all duration-300">
            <div className="drag-handle p-2 border-b border-[var(--glass-border)] bg-muted/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted/40 transition-colors">
              <Move className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-6 flex-1 overflow-auto">
              <h3 className="text-lg font-semibold mb-2">Contribute Data</h3>
              <p className="text-xs text-muted-foreground mb-4">Add recent costs you've incurred.</p>
              <ContributeForm onDataAdded={handleDataAdded} />
            </div>
          </div>

          {/* Data Grid Widget */}
          <div key="grid" className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl shadow-lg flex flex-col h-full overflow-hidden hover:border-primary/40 transition-all duration-300">
            <div className="drag-handle p-2 border-b border-[var(--glass-border)] bg-muted/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted/40 transition-colors">
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

  );
}
