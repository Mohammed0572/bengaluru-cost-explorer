import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CostItem {
  id: string;
  category: string;
  item: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
}

const costOfLivingData: CostItem[] = [
  // Housing
  { id: "h1", category: "Housing", item: "1 BHK Apartment (City Centre)", minPrice: 15000, maxPrice: 30000, avgPrice: 22000, unit: "₹/month" },
  { id: "h2", category: "Housing", item: "1 BHK Apartment (Outside Centre)", minPrice: 10000, maxPrice: 18000, avgPrice: 14000, unit: "₹/month" },
  { id: "h3", category: "Housing", item: "2 BHK Apartment (City Centre)", minPrice: 25000, maxPrice: 50000, avgPrice: 35000, unit: "₹/month" },
  { id: "h4", category: "Housing", item: "2 BHK Apartment (Outside Centre)", minPrice: 15000, maxPrice: 30000, avgPrice: 22000, unit: "₹/month" },
  { id: "h5", category: "Housing", item: "3 BHK Apartment (City Centre)", minPrice: 40000, maxPrice: 80000, avgPrice: 55000, unit: "₹/month" },
  
  // Food
  { id: "f1", category: "Food", item: "Meal at Inexpensive Restaurant", minPrice: 150, maxPrice: 350, avgPrice: 250, unit: "₹" },
  { id: "f2", category: "Food", item: "Meal for 2, Mid-range Restaurant", minPrice: 800, maxPrice: 2000, avgPrice: 1200, unit: "₹" },
  { id: "f3", category: "Food", item: "McMeal at McDonald's", minPrice: 300, maxPrice: 400, avgPrice: 350, unit: "₹" },
  { id: "f4", category: "Food", item: "Cappuccino", minPrice: 100, maxPrice: 250, avgPrice: 180, unit: "₹" },
  { id: "f5", category: "Food", item: "Milk (1 liter)", minPrice: 50, maxPrice: 80, avgPrice: 60, unit: "₹" },
  { id: "f6", category: "Food", item: "Rice (1kg)", minPrice: 50, maxPrice: 100, avgPrice: 70, unit: "₹" },
  { id: "f7", category: "Food", item: "Chicken (1kg)", minPrice: 180, maxPrice: 300, avgPrice: 240, unit: "₹" },
  
  // Transportation
  { id: "t1", category: "Transportation", item: "One-way Metro Ticket", minPrice: 10, maxPrice: 60, avgPrice: 30, unit: "₹" },
  { id: "t2", category: "Transportation", item: "Monthly Metro Pass", minPrice: 1000, maxPrice: 1500, avgPrice: 1200, unit: "₹" },
  { id: "t3", category: "Transportation", item: "Auto Rickshaw (1km)", minPrice: 15, maxPrice: 25, avgPrice: 20, unit: "₹" },
  { id: "t4", category: "Transportation", item: "Gasoline (1 liter)", minPrice: 100, maxPrice: 110, avgPrice: 105, unit: "₹" },
  { id: "t5", category: "Transportation", item: "Uber/Ola (8km ride)", minPrice: 120, maxPrice: 250, avgPrice: 180, unit: "₹" },
  
  // Utilities
  { id: "u1", category: "Utilities", item: "Basic Utilities (Electricity, Water, Gas)", minPrice: 2000, maxPrice: 4000, avgPrice: 3000, unit: "₹/month" },
  { id: "u2", category: "Utilities", item: "Internet (60 Mbps)", minPrice: 500, maxPrice: 1500, avgPrice: 800, unit: "₹/month" },
  { id: "u3", category: "Utilities", item: "Mobile Phone Plan (1GB data)", minPrice: 200, maxPrice: 500, avgPrice: 300, unit: "₹/month" },
  
  // Entertainment
  { id: "e1", category: "Entertainment", item: "Cinema Ticket", minPrice: 150, maxPrice: 500, avgPrice: 300, unit: "₹" },
  { id: "e2", category: "Entertainment", item: "Gym Membership", minPrice: 1000, maxPrice: 3000, avgPrice: 1800, unit: "₹/month" },
  { id: "e3", category: "Entertainment", item: "Netflix Subscription", minPrice: 149, maxPrice: 649, avgPrice: 499, unit: "₹/month" },
  { id: "e4", category: "Entertainment", item: "Beer (0.5L) at Restaurant", minPrice: 150, maxPrice: 400, avgPrice: 250, unit: "₹" },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const searchTerm = url.searchParams.get('search')?.toLowerCase();

    let filteredData = [...costOfLivingData];

    // Filter by category if provided
    if (category && category !== 'All') {
      filteredData = filteredData.filter(item => item.category === category);
    }

    // Filter by search term if provided
    if (searchTerm) {
      filteredData = filteredData.filter(item => 
        item.item.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate summary statistics
    const summary = {
      totalItems: filteredData.length,
      avgCost: filteredData.reduce((sum, item) => sum + item.avgPrice, 0) / filteredData.length || 0,
      categories: [...new Set(costOfLivingData.map(item => item.category))],
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: filteredData,
        summary,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in cost-of-living function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
