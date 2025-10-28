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
  area: string;
}

const costOfLivingData: CostItem[] = [
  // Housing - Koramangala
  { id: "h1", category: "Housing", item: "1 BHK Apartment", minPrice: 20000, maxPrice: 35000, avgPrice: 27000, unit: "₹/month", area: "Koramangala" },
  { id: "h2", category: "Housing", item: "2 BHK Apartment", minPrice: 35000, maxPrice: 55000, avgPrice: 45000, unit: "₹/month", area: "Koramangala" },
  { id: "h3", category: "Housing", item: "3 BHK Apartment", minPrice: 50000, maxPrice: 90000, avgPrice: 70000, unit: "₹/month", area: "Koramangala" },
  
  // Housing - Whitefield
  { id: "h4", category: "Housing", item: "1 BHK Apartment", minPrice: 15000, maxPrice: 25000, avgPrice: 20000, unit: "₹/month", area: "Whitefield" },
  { id: "h5", category: "Housing", item: "2 BHK Apartment", minPrice: 25000, maxPrice: 40000, avgPrice: 32000, unit: "₹/month", area: "Whitefield" },
  { id: "h6", category: "Housing", item: "3 BHK Apartment", minPrice: 40000, maxPrice: 65000, avgPrice: 52000, unit: "₹/month", area: "Whitefield" },
  
  // Housing - Indiranagar
  { id: "h7", category: "Housing", item: "1 BHK Apartment", minPrice: 22000, maxPrice: 38000, avgPrice: 30000, unit: "₹/month", area: "Indiranagar" },
  { id: "h8", category: "Housing", item: "2 BHK Apartment", minPrice: 38000, maxPrice: 60000, avgPrice: 49000, unit: "₹/month", area: "Indiranagar" },
  { id: "h9", category: "Housing", item: "3 BHK Apartment", minPrice: 55000, maxPrice: 95000, avgPrice: 75000, unit: "₹/month", area: "Indiranagar" },
  
  // Housing - HSR Layout
  { id: "h10", category: "Housing", item: "1 BHK Apartment", minPrice: 18000, maxPrice: 30000, avgPrice: 24000, unit: "₹/month", area: "HSR Layout" },
  { id: "h11", category: "Housing", item: "2 BHK Apartment", minPrice: 30000, maxPrice: 48000, avgPrice: 39000, unit: "₹/month", area: "HSR Layout" },
  { id: "h12", category: "Housing", item: "3 BHK Apartment", minPrice: 45000, maxPrice: 75000, avgPrice: 60000, unit: "₹/month", area: "HSR Layout" },
  
  // Housing - Electronic City
  { id: "h13", category: "Housing", item: "1 BHK Apartment", minPrice: 12000, maxPrice: 20000, avgPrice: 16000, unit: "₹/month", area: "Electronic City" },
  { id: "h14", category: "Housing", item: "2 BHK Apartment", minPrice: 20000, maxPrice: 35000, avgPrice: 27000, unit: "₹/month", area: "Electronic City" },
  { id: "h15", category: "Housing", item: "3 BHK Apartment", minPrice: 35000, maxPrice: 55000, avgPrice: 45000, unit: "₹/month", area: "Electronic City" },
  
  // Housing - Marathahalli
  { id: "h16", category: "Housing", item: "1 BHK Apartment", minPrice: 14000, maxPrice: 22000, avgPrice: 18000, unit: "₹/month", area: "Marathahalli" },
  { id: "h17", category: "Housing", item: "2 BHK Apartment", minPrice: 24000, maxPrice: 38000, avgPrice: 31000, unit: "₹/month", area: "Marathahalli" },
  { id: "h18", category: "Housing", item: "3 BHK Apartment", minPrice: 38000, maxPrice: 60000, avgPrice: 49000, unit: "₹/month", area: "Marathahalli" },
  
  // Housing - Jayanagar
  { id: "h19", category: "Housing", item: "1 BHK Apartment", minPrice: 16000, maxPrice: 28000, avgPrice: 22000, unit: "₹/month", area: "Jayanagar" },
  { id: "h20", category: "Housing", item: "2 BHK Apartment", minPrice: 28000, maxPrice: 45000, avgPrice: 36000, unit: "₹/month", area: "Jayanagar" },
  { id: "h21", category: "Housing", item: "3 BHK Apartment", minPrice: 42000, maxPrice: 70000, avgPrice: 56000, unit: "₹/month", area: "Jayanagar" },
  
  // Food - Koramangala
  { id: "f1", category: "Food", item: "Meal at Inexpensive Restaurant", minPrice: 200, maxPrice: 400, avgPrice: 300, unit: "₹", area: "Koramangala" },
  { id: "f2", category: "Food", item: "Meal for 2, Mid-range Restaurant", minPrice: 1000, maxPrice: 2500, avgPrice: 1500, unit: "₹", area: "Koramangala" },
  { id: "f3", category: "Food", item: "Cappuccino", minPrice: 150, maxPrice: 300, avgPrice: 220, unit: "₹", area: "Koramangala" },
  
  // Food - Whitefield
  { id: "f4", category: "Food", item: "Meal at Inexpensive Restaurant", minPrice: 150, maxPrice: 300, avgPrice: 220, unit: "₹", area: "Whitefield" },
  { id: "f5", category: "Food", item: "Meal for 2, Mid-range Restaurant", minPrice: 800, maxPrice: 1800, avgPrice: 1200, unit: "₹", area: "Whitefield" },
  { id: "f6", category: "Food", item: "Cappuccino", minPrice: 120, maxPrice: 250, avgPrice: 180, unit: "₹", area: "Whitefield" },
  
  // Food - Indiranagar
  { id: "f7", category: "Food", item: "Meal at Inexpensive Restaurant", minPrice: 200, maxPrice: 450, avgPrice: 320, unit: "₹", area: "Indiranagar" },
  { id: "f8", category: "Food", item: "Meal for 2, Mid-range Restaurant", minPrice: 1200, maxPrice: 3000, avgPrice: 1800, unit: "₹", area: "Indiranagar" },
  { id: "f9", category: "Food", item: "Cappuccino", minPrice: 160, maxPrice: 320, avgPrice: 240, unit: "₹", area: "Indiranagar" },
  
  // Food - HSR Layout
  { id: "f10", category: "Food", item: "Meal at Inexpensive Restaurant", minPrice: 180, maxPrice: 350, avgPrice: 260, unit: "₹", area: "HSR Layout" },
  { id: "f11", category: "Food", item: "Meal for 2, Mid-range Restaurant", minPrice: 900, maxPrice: 2000, avgPrice: 1300, unit: "₹", area: "HSR Layout" },
  { id: "f12", category: "Food", item: "Cappuccino", minPrice: 130, maxPrice: 260, avgPrice: 190, unit: "₹", area: "HSR Layout" },
  
  // Food - Electronic City
  { id: "f13", category: "Food", item: "Meal at Inexpensive Restaurant", minPrice: 120, maxPrice: 250, avgPrice: 180, unit: "₹", area: "Electronic City" },
  { id: "f14", category: "Food", item: "Meal for 2, Mid-range Restaurant", minPrice: 700, maxPrice: 1500, avgPrice: 1000, unit: "₹", area: "Electronic City" },
  { id: "f15", category: "Food", item: "Cappuccino", minPrice: 100, maxPrice: 200, avgPrice: 150, unit: "₹", area: "Electronic City" },
  
  // Transportation - All Areas (same across city)
  { id: "t1", category: "Transportation", item: "One-way Metro Ticket", minPrice: 10, maxPrice: 60, avgPrice: 30, unit: "₹", area: "All Areas" },
  { id: "t2", category: "Transportation", item: "Monthly Metro Pass", minPrice: 1000, maxPrice: 1500, avgPrice: 1200, unit: "₹", area: "All Areas" },
  { id: "t3", category: "Transportation", item: "Auto Rickshaw (1km)", minPrice: 15, maxPrice: 25, avgPrice: 20, unit: "₹", area: "All Areas" },
  { id: "t4", category: "Transportation", item: "Gasoline (1 liter)", minPrice: 100, maxPrice: 110, avgPrice: 105, unit: "₹", area: "All Areas" },
  { id: "t5", category: "Transportation", item: "Uber/Ola (8km ride)", minPrice: 120, maxPrice: 250, avgPrice: 180, unit: "₹", area: "All Areas" },
  
  // Utilities - All Areas (similar across city)
  { id: "u1", category: "Utilities", item: "Basic Utilities (Electricity, Water, Gas)", minPrice: 2000, maxPrice: 4000, avgPrice: 3000, unit: "₹/month", area: "All Areas" },
  { id: "u2", category: "Utilities", item: "Internet (60 Mbps)", minPrice: 500, maxPrice: 1500, avgPrice: 800, unit: "₹/month", area: "All Areas" },
  { id: "u3", category: "Utilities", item: "Mobile Phone Plan (1GB data)", minPrice: 200, maxPrice: 500, avgPrice: 300, unit: "₹/month", area: "All Areas" },
  
  // Entertainment - Koramangala
  { id: "e1", category: "Entertainment", item: "Cinema Ticket", minPrice: 200, maxPrice: 600, avgPrice: 400, unit: "₹", area: "Koramangala" },
  { id: "e2", category: "Entertainment", item: "Gym Membership", minPrice: 1500, maxPrice: 4000, avgPrice: 2500, unit: "₹/month", area: "Koramangala" },
  { id: "e3", category: "Entertainment", item: "Beer (0.5L) at Restaurant", minPrice: 200, maxPrice: 500, avgPrice: 350, unit: "₹", area: "Koramangala" },
  
  // Entertainment - Whitefield
  { id: "e4", category: "Entertainment", item: "Cinema Ticket", minPrice: 150, maxPrice: 450, avgPrice: 300, unit: "₹", area: "Whitefield" },
  { id: "e5", category: "Entertainment", item: "Gym Membership", minPrice: 1000, maxPrice: 3000, avgPrice: 1800, unit: "₹/month", area: "Whitefield" },
  { id: "e6", category: "Entertainment", item: "Beer (0.5L) at Restaurant", minPrice: 150, maxPrice: 400, avgPrice: 250, unit: "₹", area: "Whitefield" },
  
  // Entertainment - Indiranagar
  { id: "e7", category: "Entertainment", item: "Cinema Ticket", minPrice: 250, maxPrice: 700, avgPrice: 450, unit: "₹", area: "Indiranagar" },
  { id: "e8", category: "Entertainment", item: "Gym Membership", minPrice: 2000, maxPrice: 5000, avgPrice: 3000, unit: "₹/month", area: "Indiranagar" },
  { id: "e9", category: "Entertainment", item: "Beer (0.5L) at Restaurant", minPrice: 250, maxPrice: 600, avgPrice: 400, unit: "₹", area: "Indiranagar" },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const area = url.searchParams.get('area');
    const searchTerm = url.searchParams.get('search')?.toLowerCase();

    let filteredData = [...costOfLivingData];

    // Filter by category if provided
    if (category && category !== 'All') {
      filteredData = filteredData.filter(item => item.category === category);
    }

    // Filter by area if provided
    if (area && area !== 'All Areas') {
      filteredData = filteredData.filter(item => item.area === area || item.area === 'All Areas');
    }

    // Filter by search term if provided
    if (searchTerm) {
      filteredData = filteredData.filter(item => 
        item.item.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.area.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate summary statistics
    const summary = {
      totalItems: filteredData.length,
      avgCost: filteredData.reduce((sum, item) => sum + item.avgPrice, 0) / filteredData.length || 0,
      categories: [...new Set(costOfLivingData.map(item => item.category))],
      areas: [...new Set(costOfLivingData.map(item => item.area))].sort(),
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
