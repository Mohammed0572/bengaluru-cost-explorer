import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export interface RestaurantListing {
  name: string;
  address: string;
  location: string;
  rating: number | null;
  votes: number;
  cost_for_two: number;
  cuisines: string;
  rest_type: string;
}

export interface PropertyListing {
  area: number;
  location: string;
  bhk: number;
  bath: number;
  property_type: string;
  price: number;
}

export const fallbackRestaurants: RestaurantListing[] = [
  { name: "CTR Shri Sagar", address: "7th Cross Road, Malleswaram", location: "Malleswaram", rating: 4.6, votes: 12480, cost_for_two: 250, cuisines: "South Indian, Breakfast", rest_type: "Quick Bites" },
  { name: "Meghana Foods", address: "Koramangala 5th Block", location: "Koramangala", rating: 4.4, votes: 18930, cost_for_two: 700, cuisines: "Biryani, Andhra, North Indian", rest_type: "Casual Dining" },
  { name: "Toit", address: "100 Feet Road, Indiranagar", location: "Indiranagar", rating: 4.5, votes: 21500, cost_for_two: 2000, cuisines: "Continental, Pizza, Beverages", rest_type: "Pub" },
  { name: "Rameshwaram Cafe", address: "JP Nagar and Indiranagar", location: "Indiranagar", rating: 4.3, votes: 9800, cost_for_two: 300, cuisines: "South Indian, Snacks", rest_type: "Quick Bites" },
  { name: "Truffles", address: "80 Feet Road, Koramangala", location: "Koramangala", rating: 4.2, votes: 15420, cost_for_two: 900, cuisines: "Cafe, Burgers, Continental", rest_type: "Cafe" },
  { name: "Windmills Craftworks", address: "Whitefield Main Road", location: "Whitefield", rating: 4.4, votes: 7340, cost_for_two: 2500, cuisines: "Continental, North Indian, Craft Beer", rest_type: "Microbrewery" },
];

export const fallbackProperties: PropertyListing[] = [
  { area: 650, location: "Indiranagar", bhk: 1, bath: 1, property_type: "Apartment", price: 18000000 },
  { area: 1180, location: "Indiranagar", bhk: 2, bath: 2, property_type: "Apartment", price: 32000000 },
  { area: 1250, location: "Koramangala", bhk: 2, bath: 2, property_type: "Apartment", price: 28500000 },
  { area: 1680, location: "Koramangala", bhk: 3, bath: 3, property_type: "Apartment", price: 42000000 },
  { area: 1450, location: "Whitefield", bhk: 3, bath: 2, property_type: "Apartment", price: 18500000 },
  { area: 2100, location: "Whitefield", bhk: 4, bath: 4, property_type: "Villa", price: 38000000 },
  { area: 980, location: "HSR Layout", bhk: 2, bath: 2, property_type: "Apartment", price: 17500000 },
  { area: 1550, location: "Jayanagar", bhk: 3, bath: 3, property_type: "Apartment", price: 36000000 },
  { area: 760, location: "Malleswaram", bhk: 1, bath: 1, property_type: "Apartment", price: 15000000 },
];

export const filterByLocation = <T extends { location: string }>(items: T[], area: string) => {
  const query = area.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => item.location.toLowerCase().includes(query));
};

/**
 * Fetch restaurants from Supabase, falling back to the Express /api endpoint,
 * and then to hardcoded fallback data.
 */
export const fetchRestaurants = async (
  area = "",
  limit = 50,
  page = 1,
): Promise<RestaurantListing[]> => {
  // 1. Try Supabase
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from("restaurants")
        .select("name, address, location, rating, votes, cost_for_two, cuisines, rest_type")
        .order("rating", { ascending: false, nullsFirst: false })
        .order("votes", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (area) {
        query = query.ilike("location", `%${area}%`);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          name: r.name,
          address: r.address ?? "",
          location: r.location,
          rating: r.rating,
          votes: Number(r.votes),
          cost_for_two: Number(r.cost_for_two),
          cuisines: r.cuisines ?? "",
          rest_type: r.rest_type ?? "",
        }));
      }
    } catch {
      // fall through to API
    }
  }

  // 2. Try Express API
  try {
    const res = await fetch(
      `/api/restaurants?area=${encodeURIComponent(area)}&limit=${limit}&page=${page}`,
    );
    const data = await res.json();
    if (res.ok && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // fall through to fallback
  }

  // 3. Hardcoded fallback
  return filterByLocation(fallbackRestaurants, area);
};

/**
 * Fetch real-estate listings from Supabase, falling back to the Express /api
 * endpoint, and then to hardcoded fallback data.
 */
export const fetchProperties = async (
  area = "",
  limit = 50,
  page = 1,
): Promise<PropertyListing[]> => {
  // 1. Try Supabase
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from("real_estate")
        .select("area, location, bhk, bath, property_type, price")
        .order("price", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (area) {
        query = query.ilike("location", `%${area}%`);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          area: Number(p.area),
          location: p.location,
          bhk: Number(p.bhk),
          bath: Number(p.bath),
          property_type: p.property_type,
          price: Number(p.price),
        }));
      }
    } catch {
      // fall through to API
    }
  }

  // 2. Try Express API
  try {
    const res = await fetch(
      `/api/real-estate?area=${encodeURIComponent(area)}&limit=${limit}&page=${page}`,
    );
    const data = await res.json();
    if (res.ok && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // fall through to fallback
  }

  // 3. Hardcoded fallback
  return filterByLocation(fallbackProperties, area);
};
