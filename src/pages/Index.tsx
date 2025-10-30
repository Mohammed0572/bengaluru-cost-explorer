import { useState, useEffect } from "react";
import { Home, UtensilsCrossed, Car, Zap, Gamepad2, Search, Info, Mail, LogIn, LogOut, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryCard } from "@/components/CategoryCard";
import { CostItem } from "@/components/CostItem";
import { AreaSelector } from "@/components/AreaSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { CostCharts } from "@/components/CostCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CostData {
  id: string;
  category: string;
  item: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
  area: string;
}

const categories = [
  { name: "All", icon: Home, gradient: "bg-gradient-to-br from-primary/20 to-secondary/20" },
  { name: "Housing", icon: Home, gradient: "bg-gradient-to-br from-blue-500/20 to-blue-600/20" },
  { name: "Food", icon: UtensilsCrossed, gradient: "bg-gradient-to-br from-purple-500/20 to-purple-600/20" },
  { name: "Transportation", icon: Car, gradient: "bg-gradient-to-br from-cyan-500/20 to-cyan-600/20" },
  { name: "Utilities", icon: Zap, gradient: "bg-gradient-to-br from-teal-500/20 to-teal-600/20" },
  { name: "Entertainment", icon: Gamepad2, gradient: "bg-gradient-to-br from-pink-500/20 to-pink-600/20" },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [searchTerm, setSearchTerm] = useState("");
  const [costData, setCostData] = useState<CostData[]>([]);
  const [areas, setAreas] = useState<string[]>(["All Areas"]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchCostData();
  }, [activeCategory, selectedArea, searchTerm]);

  const fetchCostData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.append("category", activeCategory);
      if (selectedArea !== "All Areas") params.append("area", selectedArea);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cost-of-living?${params}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      if (result.success) {
        setCostData(result.data);
        if (result.summary?.areas) {
          setAreas(result.summary.areas);
        }
      }
    } catch (error) {
      console.error("Error fetching cost data:", error);
      toast({
        title: "Error",
        description: "Failed to load cost of living data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "All") return costData.length;
    return costData.filter((item) => item.category === categoryName).length;
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bengaluru Cost of Living
          </h2>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" className="gap-2 hover:bg-primary/10 transition-all">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="gap-2 hover:bg-primary/10 transition-all">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" className="gap-2 hover:bg-primary/10 transition-all">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
            </Link>
            {user ? (
              <Button 
                variant="ghost" 
                className="gap-2 hover:bg-primary/10 transition-all"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="gap-2 hover:bg-primary/10 transition-all">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 blur-3xl" />
        
        <header className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Cost of Living
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Bengaluru, India
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg bg-card/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary transition-all duration-300"
            />
          </div>
        </header>
      </div>

      {/* Area Selector */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex justify-center">
          <AreaSelector
            areas={areas}
            selectedArea={selectedArea}
            onAreaChange={setSelectedArea}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              title={category.name}
              icon={category.icon}
              count={getCategoryCount(category.name)}
              isActive={activeCategory === category.name}
              onClick={() => setActiveCategory(category.name)}
              gradientClass={category.gradient}
            />
          ))}
        </div>
      </section>

      {/* Data Visualization Tabs */}
      <section className="container mx-auto px-4 pb-16">
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {activeCategory === "All" ? "All Items" : activeCategory}
                {selectedArea !== "All Areas" && ` in ${selectedArea}`}
              </h2>
              <p className="text-muted-foreground">
                {costData.length} items found
              </p>
            </div>
            <TabsList>
              <TabsTrigger value="grid" className="gap-2">
                <Home className="h-4 w-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="charts" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Charts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl" />
                ))}
              </div>
            ) : costData.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No items found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {costData.map((item) => (
                  <CostItem
                    key={item.id}
                    item={item.item}
                    minPrice={item.minPrice}
                    maxPrice={item.maxPrice}
                    avgPrice={item.avgPrice}
                    unit={item.unit}
                    area={item.area}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="charts">
            {loading ? (
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-96 rounded-2xl" />
                ))}
              </div>
            ) : costData.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No data available for charts</p>
              </div>
            ) : (
              <CostCharts data={costData} />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Index;
