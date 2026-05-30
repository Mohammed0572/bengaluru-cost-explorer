-- Market data tables for Bengaluru Cost Explorer.
-- CSV files remain untouched; these seed rows provide app-ready data in Supabase.

CREATE TABLE IF NOT EXISTS public.cost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  min_price NUMERIC NOT NULL DEFAULT 0,
  max_price NUMERIC NOT NULL DEFAULT 0,
  avg_price NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'unit',
  area TEXT NOT NULL DEFAULT 'Bengaluru',
  source TEXT NOT NULL DEFAULT 'seed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  location TEXT NOT NULL,
  rating NUMERIC,
  votes INTEGER NOT NULL DEFAULT 0,
  cost_for_two NUMERIC NOT NULL DEFAULT 0,
  cuisines TEXT,
  rest_type TEXT,
  source TEXT NOT NULL DEFAULT 'seed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (name, location)
);

CREATE TABLE IF NOT EXISTS public.real_estate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area NUMERIC NOT NULL,
  location TEXT NOT NULL,
  bhk INTEGER NOT NULL,
  bath INTEGER NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'Property',
  price NUMERIC NOT NULL,
  source TEXT NOT NULL DEFAULT 'seed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (location, bhk, bath, area, property_type, price)
);

CREATE INDEX IF NOT EXISTS cost_items_area_idx ON public.cost_items (area);
CREATE INDEX IF NOT EXISTS cost_items_category_idx ON public.cost_items (category);
CREATE INDEX IF NOT EXISTS restaurants_location_idx ON public.restaurants (location);
CREATE INDEX IF NOT EXISTS restaurants_rating_idx ON public.restaurants (rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS real_estate_location_idx ON public.real_estate (location);
CREATE INDEX IF NOT EXISTS real_estate_price_idx ON public.real_estate (price DESC);

ALTER TABLE public.cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view cost items" ON public.cost_items;
CREATE POLICY "Anyone can view cost items"
ON public.cost_items
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can submit cost items" ON public.cost_items;
CREATE POLICY "Anyone can submit cost items"
ON public.cost_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view restaurants" ON public.restaurants;
CREATE POLICY "Anyone can view restaurants"
ON public.restaurants
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can view real estate" ON public.real_estate;
CREATE POLICY "Anyone can view real estate"
ON public.real_estate
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.cost_items (category, item, min_price, max_price, avg_price, unit, area)
VALUES
  -- Housing across 7 neighborhoods
  ('Housing', '1BHK Rent', 20000, 35000, 27000, 'month', 'Koramangala'),
  ('Housing', '2BHK Rent', 35000, 55000, 45000, 'month', 'Koramangala'),
  ('Housing', '3BHK Rent', 50000, 90000, 70000, 'month', 'Koramangala'),
  ('Housing', '1BHK Rent', 15000, 25000, 20000, 'month', 'Whitefield'),
  ('Housing', '2BHK Rent', 25000, 40000, 32000, 'month', 'Whitefield'),
  ('Housing', '3BHK Rent', 40000, 65000, 52000, 'month', 'Whitefield'),
  ('Housing', '1BHK Rent', 22000, 38000, 30000, 'month', 'Indiranagar'),
  ('Housing', '2BHK Rent', 38000, 60000, 49000, 'month', 'Indiranagar'),
  ('Housing', '3BHK Rent', 55000, 95000, 75000, 'month', 'Indiranagar'),
  ('Housing', '1BHK Rent', 18000, 30000, 24000, 'month', 'HSR Layout'),
  ('Housing', '2BHK Rent', 30000, 48000, 39000, 'month', 'HSR Layout'),
  ('Housing', '3BHK Rent', 45000, 75000, 60000, 'month', 'HSR Layout'),
  ('Housing', '1BHK Rent', 12000, 20000, 16000, 'month', 'Electronic City'),
  ('Housing', '2BHK Rent', 20000, 35000, 27000, 'month', 'Electronic City'),
  ('Housing', '3BHK Rent', 35000, 55000, 45000, 'month', 'Electronic City'),
  ('Housing', '1BHK Rent', 14000, 22000, 18000, 'month', 'Marathahalli'),
  ('Housing', '2BHK Rent', 24000, 38000, 31000, 'month', 'Marathahalli'),
  ('Housing', '3BHK Rent', 38000, 60000, 49000, 'month', 'Marathahalli'),
  ('Housing', '1BHK Rent', 16000, 28000, 22000, 'month', 'Jayanagar'),
  ('Housing', '2BHK Rent', 28000, 45000, 36000, 'month', 'Jayanagar'),
  ('Housing', '3BHK Rent', 42000, 70000, 56000, 'month', 'Jayanagar'),
  ('Housing', 'PG Accommodation', 10000, 15000, 12000, 'month', 'HSR Layout'),
  ('Housing', 'PG Accommodation', 8000, 12000, 10000, 'month', 'Electronic City'),
  ('Housing', 'PG Accommodation', 12000, 18000, 14000, 'month', 'Koramangala'),
  ('Housing', '1BHK Rent', 16000, 26000, 21000, 'month', 'Malleswaram'),
  -- Food across neighborhoods
  ('Food', 'Filter Coffee', 20, 40, 30, 'cup', 'Malleswaram'),
  ('Food', 'Masala Dosa', 40, 80, 60, 'plate', 'Jayanagar'),
  ('Food', 'Lunch Thali', 120, 200, 150, 'meal', 'Koramangala'),
  ('Food', 'Restaurant Meal', 200, 400, 300, 'meal', 'Koramangala'),
  ('Food', 'Restaurant Meal', 150, 300, 220, 'meal', 'Whitefield'),
  ('Food', 'Restaurant Meal', 200, 450, 320, 'meal', 'Indiranagar'),
  ('Food', 'Restaurant Meal', 180, 350, 260, 'meal', 'HSR Layout'),
  ('Food', 'Restaurant Meal', 120, 250, 180, 'meal', 'Electronic City'),
  ('Food', 'Cappuccino', 150, 300, 220, 'cup', 'Koramangala'),
  ('Food', 'Cappuccino', 120, 250, 180, 'cup', 'Whitefield'),
  ('Food', 'Cappuccino', 160, 320, 240, 'cup', 'Indiranagar'),
  ('Food', 'Groceries', 4000, 6000, 5000, 'month', 'All Areas'),
  -- Transportation
  ('Transportation', 'Metro Pass', 1000, 1500, 1200, 'month', 'All Areas'),
  ('Transportation', 'One-way Metro Ticket', 10, 60, 30, 'ride', 'All Areas'),
  ('Transportation', 'Auto Ride (5km)', 80, 120, 100, 'ride', 'All Areas'),
  ('Transportation', 'Ola/Uber (8km)', 120, 250, 180, 'ride', 'All Areas'),
  ('Transportation', 'Petrol (1L)', 100, 110, 105, 'liter', 'All Areas'),
  -- Utilities
  ('Utilities', 'Electricity', 800, 2000, 1200, 'month', 'All Areas'),
  ('Utilities', 'Internet (100Mbps)', 700, 1500, 999, 'month', 'All Areas'),
  ('Utilities', 'Water', 200, 500, 300, 'month', 'All Areas'),
  ('Utilities', 'Mobile Plan', 200, 500, 300, 'month', 'All Areas'),
  -- Entertainment
  ('Entertainment', 'Movie Ticket', 200, 600, 350, 'ticket', 'All Areas'),
  ('Entertainment', 'Pub Cover Charge', 1000, 2000, 1500, 'person', 'Indiranagar'),
  ('Entertainment', 'Pub Cover Charge', 800, 1500, 1100, 'person', 'Koramangala'),
  ('Entertainment', 'Streaming Services', 500, 800, 650, 'month', 'All Areas'),
  ('Entertainment', 'Gym Membership', 1500, 4000, 2500, 'month', 'Koramangala'),
  ('Entertainment', 'Gym Membership', 1000, 3000, 1800, 'month', 'Whitefield'),
  ('Entertainment', 'Gym Membership', 2000, 5000, 3000, 'month', 'Indiranagar'),
  -- Healthcare
  ('Healthcare', 'Pharmacy', 500, 1200, 800, 'month', 'All Areas'),
  ('Healthcare', 'Doctor Consultation', 500, 1500, 1000, 'visit', 'All Areas'),
  -- Fitness & Lifestyle
  ('Fitness & Lifestyle', 'Budget Gym', 1000, 2500, 1800, 'month', 'All Areas'),
  ('Fitness & Lifestyle', 'Premium Club', 3000, 8000, 5000, 'month', 'All Areas')
ON CONFLICT DO NOTHING;

INSERT INTO public.restaurants (name, address, location, rating, votes, cost_for_two, cuisines, rest_type)
VALUES
  ('CTR Shri Sagar', '7th Cross Road, Malleswaram', 'Malleswaram', 4.6, 12480, 250, 'South Indian, Breakfast', 'Quick Bites'),
  ('Meghana Foods', 'Koramangala 5th Block', 'Koramangala', 4.4, 18930, 700, 'Biryani, Andhra, North Indian', 'Casual Dining'),
  ('Toit', '100 Feet Road, Indiranagar', 'Indiranagar', 4.5, 21500, 2000, 'Continental, Pizza, Beverages', 'Pub'),
  ('Rameshwaram Cafe', 'JP Nagar and Indiranagar', 'Indiranagar', 4.3, 9800, 300, 'South Indian, Snacks', 'Quick Bites'),
  ('Truffles', '80 Feet Road, Koramangala', 'Koramangala', 4.2, 15420, 900, 'Cafe, Burgers, Continental', 'Cafe'),
  ('Windmills Craftworks', 'Whitefield Main Road', 'Whitefield', 4.4, 7340, 2500, 'Continental, North Indian, Craft Beer', 'Microbrewery')
ON CONFLICT (name, location) DO UPDATE SET
  address = EXCLUDED.address,
  rating = EXCLUDED.rating,
  votes = EXCLUDED.votes,
  cost_for_two = EXCLUDED.cost_for_two,
  cuisines = EXCLUDED.cuisines,
  rest_type = EXCLUDED.rest_type;

INSERT INTO public.real_estate (area, location, bhk, bath, property_type, price)
VALUES
  (650, 'Indiranagar', 1, 1, 'Apartment', 18000000),
  (1180, 'Indiranagar', 2, 2, 'Apartment', 32000000),
  (1250, 'Koramangala', 2, 2, 'Apartment', 28500000),
  (1680, 'Koramangala', 3, 3, 'Apartment', 42000000),
  (1450, 'Whitefield', 3, 2, 'Apartment', 18500000),
  (2100, 'Whitefield', 4, 4, 'Villa', 38000000),
  (980, 'HSR Layout', 2, 2, 'Apartment', 17500000),
  (1550, 'Jayanagar', 3, 3, 'Apartment', 36000000),
  (760, 'Malleswaram', 1, 1, 'Apartment', 15000000)
ON CONFLICT (location, bhk, bath, area, property_type, price) DO NOTHING;
