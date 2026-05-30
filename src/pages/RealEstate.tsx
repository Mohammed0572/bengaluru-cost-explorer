import { useState, useEffect, useCallback } from "react";
import { Loader2, Home, MapPin, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchProperties, type PropertyListing } from "@/lib/market-data";

type Property = PropertyListing;

export default function RealEstate() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadProperties = useCallback(async (area = "", pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProperties(area, 50, pageNum);
      setProperties(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load real estate data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties(submittedSearch, page);
  }, [loadProperties, page, submittedSearch]);

  const handleSearch = () => {
    setSubmittedSearch(search);
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Home className="w-8 h-8 text-primary" /> Real Estate Market
          </h1>
          <p className="text-muted-foreground mt-1">
            Searchable Bengaluru property snapshots
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search location..." 
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
          {properties.map((prop, i) => (
            <div key={i} className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-primary">₹{Number(prop.price).toLocaleString()}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {prop.location || 'Unknown Area'}
                  </div>
                </div>
                <div className="bg-muted px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">
                  {prop.property_type || 'Property'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t pt-4 text-sm">
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-lg">
                  <span className="font-bold">{prop.bhk}</span>
                  <span className="text-xs text-muted-foreground">BHK</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-lg">
                  <span className="font-bold">{prop.bath}</span>
                  <span className="text-xs text-muted-foreground">Baths</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-lg">
                  <span className="font-bold flex items-center gap-1"><Layers className="w-3 h-3"/> {prop.area}</span>
                  <span className="text-xs text-muted-foreground">Sq.Ft</span>
                </div>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No properties found in this location.
            </div>
          )}
        </div>
      )}

      {!loading && properties.length > 0 && (
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
            disabled={properties.length < 50}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
