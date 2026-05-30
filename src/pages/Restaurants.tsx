import { useState, useEffect } from "react";
import { Loader2, Utensils, Star, MapPin, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Restaurant {
  name: string;
  address: string;
  location: string;
  rating: number;
  votes: number;
  cost_for_two: number;
  cuisines: string;
  rest_type: string;
}

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchRestaurants = async (area = "", pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/restaurants?area=${encodeURIComponent(area)}&limit=50&page=${pageNum}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load restaurants");
      }

      if (!Array.isArray(data)) {
        throw new Error("Restaurant API returned an unexpected response");
      }

      setRestaurants(data);
    } catch (err) {
      console.error(err);
      setRestaurants([]);
      setError(err instanceof Error ? err.message : "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(committedSearch, page);
  }, [committedSearch, page]);

  const handleSearch = () => {
    setCommittedSearch(search);
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Utensils className="w-8 h-8 text-primary" /> Top Restaurants
          </h1>
          <p className="text-muted-foreground mt-1">
            Powered by Zomato dataset (574MB dynamic query)
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search neighborhood..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full md:w-[300px]"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((rest, i) => (
            <div key={i} className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg line-clamp-1">{rest.name}</h3>
                <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded-md text-sm font-bold">
                  <span>{rest.rating || 'N/A'}</span>
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1 mb-4">{rest.cuisines}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary/70" />
                  <span className="line-clamp-1">{rest.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IndianRupee className="w-4 h-4 text-primary/70" />
                  <span>₹{rest.cost_for_two || '?'} for two</span>
                </div>
              </div>
            </div>
          ))}
          {restaurants.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No restaurants found in this area.
            </div>
          )}
        </div>
      )}
      
      {!loading && restaurants.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">Page {page}</span>
          <Button 
            variant="outline" 
            onClick={() => setPage(p => p + 1)}
            disabled={restaurants.length < 50}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
