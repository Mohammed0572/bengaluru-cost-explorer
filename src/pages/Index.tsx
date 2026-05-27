import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { CostDistributionChart } from "@/components/dashboard/CostDistributionChart";
import { RecentContributions } from "@/components/dashboard/RecentContributions";
import { ContributeForm } from "@/components/ContributeForm";
import { NeighborhoodSelector } from "@/components/dashboard/NeighborhoodSelector";
import { Calculator, IndianRupee, TrendingUp, Tags } from "lucide-react";
import { generateMockData, CostItem } from "@/lib/mock-data";
import type { DashboardContextType } from "@/components/layout/DashboardLayout";

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
  const [items, setItems] = useState<CostItem[]>(generateMockData());
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const { searchTerm } = useOutletContext<DashboardContextType>();

  const handleDataAdded = () => {
    // Mocking adding data by refreshing the mock data set and showing a toast
    // In reality, this form will just pretend to work for the portfolio since Supabase is dropped
    setItems([...generateMockData()]);
  };

  // Derived Data
  const filteredItems = items.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "All Areas" || item.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    filteredItems.forEach(item => {
      const cat = item.category; 
      if (!stats[cat]) stats[cat] = { total: 0, count: 0 };
      stats[cat].total += Number(item.avg_price);
      stats[cat].count += 1;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count)
    })).sort((a, b) => b.value - a.value);
  }, [filteredItems]);

  const totalValue = categoryStats.reduce((acc, curr) => acc + curr.value, 0);
  const highestCategory = categoryStats.length > 0 ? categoryStats[0] : null;

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative bg-card border rounded-2xl p-8 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
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

      {/* Middle Row: Charts & Form */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 h-full">
          {filteredItems.length > 0 ? (
            <CostDistributionChart categoryStats={categoryStats} totalValue={totalValue} />
          ) : (
            <div className="h-full min-h-[300px] bg-card border rounded-lg shadow-sm p-6 flex flex-col items-center justify-center text-center">
              <IndianRupee className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Data for this Area</h3>
              <p className="text-muted-foreground">Try selecting a different neighborhood or contribute data below.</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-lg p-6 h-full shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Contribute Data</h3>
            <p className="text-sm text-muted-foreground mb-6">Help the community by adding recent costs you've incurred in Bengaluru.</p>
            <ContributeForm onDataAdded={handleDataAdded} />
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Data Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-1">
        <RecentContributions items={filteredItems} />
      </motion.div>
    </motion.div>
  );
}