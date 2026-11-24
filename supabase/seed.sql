-- ==============================================================================
-- BENGALURU COST EXPLORER - SAMPLE SEED DATA
-- ==============================================================================
-- This script populates sample data into `categories`, `cost_items`,
-- `restaurants`, and `real_estate` for Bengaluru neighborhoods.
--
-- How to apply:
-- Run this in the Supabase SQL Editor after running `schema.sql`.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED CATEGORIES
-- ------------------------------------------------------------------------------
INSERT INTO public.categories (name, color)
VALUES
  ('Housing', '#3B82F6'),
  ('Food & Dining', '#EF4444'),
  ('Transportation', '#10B981'),
  ('Utilities & Bills', '#F59E0B'),
  ('Groceries', '#8B5CF6'),
  ('Entertainment & Leisure', '#EC4899'),
  ('Healthcare', '#06B6D4'),
  ('Education', '#6366F1')
ON CONFLICT (name) DO UPDATE
SET color = EXCLUDED.color;

-- ------------------------------------------------------------------------------
-- 2. SEED COST OF LIVING ITEMS
-- ------------------------------------------------------------------------------
INSERT INTO public.cost_items (category, item, min_price, max_price, avg_price, unit, area, source)
VALUES
  -- Housing - Koramangala
  ('Housing', '1 BHK Apartment', 20000, 35000, 27000, '₹/month', 'Koramangala', 'Numbeo/Survey'),
  ('Housing', '2 BHK Apartment', 35000, 55000, 45000, '₹/month', 'Koramangala', 'Numbeo/Survey'),
  ('Housing', '3 BHK Apartment', 50000, 90000, 70000, '₹/month', 'Koramangala', 'Numbeo/Survey'),

  -- Housing - Indiranagar
  ('Housing', '1 BHK Apartment', 22000, 38000, 30000, '₹/month', 'Indiranagar', 'Numbeo/Survey'),
  ('Housing', '2 BHK Apartment', 38000, 60000, 49000, '₹/month', 'Indiranagar', 'Numbeo/Survey'),
  ('Housing', '3 BHK Apartment', 55000, 95000, 75000, '₹/month', 'Indiranagar', 'Numbeo/Survey'),

  -- Housing - HSR Layout
  ('Housing', '1 BHK Apartment', 18000, 30000, 24000, '₹/month', 'HSR Layout', 'Numbeo/Survey'),
  ('Housing', '2 BHK Apartment', 30000, 48000, 39000, '₹/month', 'HSR Layout', 'Numbeo/Survey'),
  ('Housing', '3 BHK Apartment', 45000, 75000, 60000, '₹/month', 'HSR Layout', 'Numbeo/Survey'),

  -- Housing - Whitefield
  ('Housing', '1 BHK Apartment', 15000, 25000, 20000, '₹/month', 'Whitefield', 'Numbeo/Survey'),
  ('Housing', '2 BHK Apartment', 25000, 40000, 32000, '₹/month', 'Whitefield', 'Numbeo/Survey'),
  ('Housing', '3 BHK Apartment', 40000, 65000, 52000, '₹/month', 'Whitefield', 'Numbeo/Survey'),

  -- Housing - Electronic City
  ('Housing', '1 BHK Apartment', 12000, 20000, 16000, '₹/month', 'Electronic City', 'Numbeo/Survey'),
  ('Housing', '2 BHK Apartment', 20000, 35000, 27000, '₹/month', 'Electronic City', 'Numbeo/Survey'),
  ('Housing', '3 BHK Apartment', 35000, 55000, 45000, '₹/month', 'Electronic City', 'Numbeo/Survey'),

  -- Housing - Jayanagar
  ('Housing', '1 BHK Apartment', 16000, 28000, 22000, '₹/month', 'Jayanagar', 'Numbeo/Survey'),
  ('Housing', '2 BHK Apartment', 28000, 45000, 36000, '₹/month', 'Jayanagar', 'Numbeo/Survey'),
  ('Housing', '3 BHK Apartment', 42000, 70000, 56000, '₹/month', 'Jayanagar', 'Numbeo/Survey'),

  -- Housing - Malleswaram
  ('Housing', '1 BHK Apartment', 15000, 26000, 21000, '₹/month', 'Malleswaram', 'Numbeo/Survey'),
  ('Housing', '2 BHK Apartment', 26000, 44000, 35000, '₹/month', 'Malleswaram', 'Numbeo/Survey'),
  ('Housing', '3 BHK Apartment', 40000, 68000, 54000, '₹/month', 'Malleswaram', 'Numbeo/Survey'),

  -- Food & Dining across Bengaluru
  ('Food & Dining', 'Inexpensive Restaurant Meal', 100, 250, 180, '₹/meal', 'Bengaluru', 'Numbeo/Survey'),
  ('Food & Dining', 'Mid-range Restaurant Meal for Two', 800, 2000, 1400, '₹/meal', 'Bengaluru', 'Numbeo/Survey'),
  ('Food & Dining', 'Specialty Coffee / Cappuccino', 140, 300, 220, '₹/cup', 'Koramangala', 'Numbeo/Survey'),
  ('Food & Dining', 'Traditional South Indian Dosa & Filter Coffee', 60, 150, 95, '₹/serving', 'Malleswaram', 'Crowdsourced'),
  ('Food & Dining', 'Daily Cook / Maid Service', 3500, 7000, 5000, '₹/month', 'HSR Layout', 'Crowdsourced'),

  -- Groceries
  ('Groceries', 'Milk (Regular, 1L)', 46, 56, 52, '₹/liter', 'Bengaluru', 'OpenCity'),
  ('Groceries', 'White Rice (1kg)', 50, 90, 70, '₹/kg', 'Bengaluru', 'OpenCity'),
  ('Groceries', 'Eggs (Pack of 12)', 75, 110, 92, '₹/dozen', 'Bengaluru', 'OpenCity'),
  ('Groceries', 'Fresh Tomatoes (1kg)', 25, 60, 40, '₹/kg', 'Bengaluru', 'OpenCity'),
  ('Groceries', 'Potatoes (1kg)', 30, 50, 40, '₹/kg', 'Bengaluru', 'OpenCity'),

  -- Transportation
  ('Transportation', 'BMTC Monthly Volvo Bus Pass', 2800, 3500, 3000, '₹/month', 'Bengaluru', 'BMTC Official'),
  ('Transportation', 'Namma Metro Monthly Commute Estimate', 1500, 3000, 2200, '₹/month', 'Bengaluru', 'BMRCL'),
  ('Transportation', 'Auto Rickshaw (Base Fare + Rate/km)', 30, 20, 18, '₹/km', 'Bengaluru', 'Official Tariff'),
  ('Transportation', 'Cab/Taxi Ride (Per km)', 22, 35, 28, '₹/km', 'Bengaluru', 'Aggregator Estimate'),
  ('Transportation', 'Petrol (1 Liter)', 100, 105, 102.86, '₹/liter', 'Bengaluru', 'IOCL'),

  -- Utilities & Bills
  ('Utilities & Bills', 'High-speed Fiber Internet (100-300 Mbps)', 600, 1200, 850, '₹/month', 'Bengaluru', 'ISP Average'),
  ('Utilities & Bills', 'Electricity Bill (2 BHK Average)', 1200, 3500, 2200, '₹/month', 'Bengaluru', 'BESCOM'),
  ('Utilities & Bills', 'Domestic Water Tanker (6000L)', 800, 1600, 1200, '₹/tanker', 'Whitefield', 'Crowdsourced'),
  ('Utilities & Bills', 'LPG Gas Cylinder (14.2 kg)', 850, 950, 905, '₹/cylinder', 'Bengaluru', 'Govt Tariff'),

  -- Entertainment & Leisure
  ('Entertainment & Leisure', 'Gym Membership (Monthly)', 1200, 4000, 2500, '₹/month', 'Koramangala', 'Survey'),
  ('Entertainment & Leisure', 'Cinema Ticket (PVR / INOX Multiplex)', 250, 600, 380, '₹/ticket', 'Indiranagar', 'Aggregator'),
  ('Entertainment & Leisure', 'Weekend Microbrewery Outing for Two', 1800, 4000, 2800, '₹/outing', 'Indiranagar', 'Survey');

-- ------------------------------------------------------------------------------
-- 3. SEED RESTAURANTS
-- ------------------------------------------------------------------------------
INSERT INTO public.restaurants (name, address, location, rating, votes, cost_for_two, cuisines, rest_type, source)
VALUES
  ('CTR Shri Sagar', '7th Cross Road, Margosa Road, Malleswaram', 'Malleswaram', 4.6, 12480, 250, 'South Indian, Street Food', 'Quick Bites', 'Zomato'),
  ('Vidyarthi Bhavan', 'Gandhi Bazaar, Basavanagudi', 'Basavanagudi', 4.5, 16200, 200, 'South Indian, Breakfast', 'Quick Bites', 'Zomato'),
  ('Brahmin''s Coffee Bar', 'Ranga Rao Road, Near Shankar Mutt, Shankarpuram', 'Basavanagudi', 4.7, 14350, 150, 'South Indian, Filter Coffee', 'Quick Bites', 'Zomato'),
  ('Meghana Foods', '1st Block, Near Sony World Signal, Koramangala', 'Koramangala', 4.4, 18930, 700, 'Biryani, Andhra, North Indian', 'Casual Dining', 'Zomato'),
  ('Toit Brewpub', '298, 100 Feet Road, Near Domlur Flyover, Indiranagar', 'Indiranagar', 4.5, 21500, 2000, 'Continental, Pizza, Craft Beer', 'Microbrewery', 'Zomato'),
  ('The Rameshwaram Cafe', '12th Main Road, HAL 2nd Stage, Indiranagar', 'Indiranagar', 4.3, 9800, 300, 'South Indian, Ghee Roast Dosa', 'Quick Bites', 'Zomato'),
  ('Truffles', '28, 4th B Cross, 5th Block, Koramangala', 'Koramangala', 4.2, 15420, 900, 'American, Burgers, Continental', 'Cafe', 'Zomato'),
  ('Windmills Craftworks', '331 Road, 5B EPIP Zone, Whitefield', 'Whitefield', 4.4, 7340, 2500, 'Continental, North Indian, Craft Beer', 'Microbrewery', 'Zomato'),
  ('Nagarjuna Restaurant', 'Residency Road, Ashok Nagar', 'Residency Road', 4.4, 11200, 800, 'Andhra, Biryani, South Indian', 'Casual Dining', 'Zomato'),
  ('Mavalli Tiffin Room (MTR)', '14, Lalbagh Road, Mavalli', 'Lalbagh', 4.5, 13780, 350, 'South Indian, Sweets, Thali', 'Quick Bites', 'Zomato'),
  ('Corner House Ice Cream', '1st A Main Road, 7th Block, Koramangala', 'Koramangala', 4.6, 11890, 350, 'Ice Cream, Desserts, Death by Chocolate', 'Dessert Parlor', 'Zomato'),
  ('Glen''s Bakehouse', '297, 100 Feet Road, Indiranagar', 'Indiranagar', 4.3, 8950, 700, 'Bakery, Desserts, Red Velvet Cupcakes', 'Bakery / Cafe', 'Zomato'),
  ('Empire Restaurant', '80 Feet Road, 6th Block, Koramangala', 'Koramangala', 4.1, 14200, 650, 'North Indian, Mughlai, Biryani, Shawarma', 'Casual Dining', 'Zomato'),
  ('Airlines Hotel', '4, Madras Bank Road, Shanthala Nagar, Ashok Nagar', 'Ashok Nagar', 4.2, 6800, 400, 'South Indian, Street Food, Open-air Dining', 'Casual Dining', 'Zomato');

-- ------------------------------------------------------------------------------
-- 4. SEED REAL ESTATE LISTINGS
-- ------------------------------------------------------------------------------
INSERT INTO public.real_estate (area, location, bhk, bath, property_type, price, source)
VALUES
  (650, 'Indiranagar', 1, 1, 'Apartment', 18000000, '99acres'),
  (1180, 'Indiranagar', 2, 2, 'Apartment', 32000000, '99acres'),
  (1850, 'Indiranagar', 3, 3, 'Apartment', 48000000, '99acres'),
  (720, 'Koramangala', 1, 1, 'Apartment', 16500000, '99acres'),
  (1250, 'Koramangala', 2, 2, 'Apartment', 28500000, '99acres'),
  (1680, 'Koramangala', 3, 3, 'Apartment', 42000000, '99acres'),
  (680, 'HSR Layout', 1, 1, 'Apartment', 11500000, '99acres'),
  (980, 'HSR Layout', 2, 2, 'Apartment', 17500000, '99acres'),
  (1520, 'HSR Layout', 3, 3, 'Apartment', 29000000, '99acres'),
  (1120, 'Whitefield', 2, 2, 'Apartment', 12500000, '99acres'),
  (1450, 'Whitefield', 3, 2, 'Apartment', 18500000, '99acres'),
  (2100, 'Whitefield', 4, 4, 'Villa', 38000000, '99acres'),
  (780, 'Electronic City', 1, 1, 'Apartment', 6500000, '99acres'),
  (1050, 'Electronic City', 2, 2, 'Apartment', 9800000, '99acres'),
  (1400, 'Electronic City', 3, 2, 'Apartment', 14500000, '99acres'),
  (1550, 'Jayanagar', 3, 3, 'Apartment', 36000000, '99acres'),
  (2200, 'Jayanagar', 4, 4, 'Independent House', 62000000, '99acres'),
  (760, 'Malleswaram', 1, 1, 'Apartment', 15000000, '99acres'),
  (1300, 'Malleswaram', 2, 2, 'Apartment', 24000000, '99acres'),
  (1200, 'Bellandur', 2, 2, 'Apartment', 16500000, '99acres'),
  (1650, 'Bellandur', 3, 3, 'Apartment', 26000000, '99acres'),
  (1100, 'Marathahalli', 2, 2, 'Apartment', 11000000, '99acres'),
  (1420, 'Marathahalli', 3, 2, 'Apartment', 16000000, '99acres');
