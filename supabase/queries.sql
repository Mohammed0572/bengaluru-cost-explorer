-- ==============================================================================
-- BENGALURU COST EXPLORER - USEFUL SQL QUERIES & ANALYTICS
-- ==============================================================================
-- These queries provide insights, power the web app's endpoints, and can be
-- executed in the Supabase SQL Editor for data analysis and reporting.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. AREA COST OVERVIEW & COMPARISON
-- ------------------------------------------------------------------------------
-- Calculates the average, minimum, and maximum cost for each category across areas.
SELECT 
  area,
  category,
  COUNT(*) AS item_count,
  ROUND(AVG(avg_price), 2) AS average_cost,
  MIN(min_price) AS lowest_price,
  MAX(max_price) AS highest_price,
  unit
FROM public.cost_items
GROUP BY area, category, unit
ORDER BY area, category;

-- ------------------------------------------------------------------------------
-- 2. ESTIMATED MONTHLY LIFESTYLE COST BY NEIGHBORHOOD (1 BHK / 2 BHK)
-- ------------------------------------------------------------------------------
-- Compares essential monthly expenses (rent + utilities + basic transit) across areas.
SELECT
  ci_rent.area,
  ci_rent.item AS housing_type,
  ci_rent.avg_price AS rent_pm,
  COALESCE(ci_util.avg_price, 2200) AS electricity_pm,
  COALESCE(ci_net.avg_price, 850) AS broadband_pm,
  COALESCE(ci_metro.avg_price, 2200) AS transit_pm,
  (ci_rent.avg_price + COALESCE(ci_util.avg_price, 2200) + COALESCE(ci_net.avg_price, 850) + COALESCE(ci_metro.avg_price, 2200)) AS estimated_fixed_monthly_cost
FROM public.cost_items ci_rent
LEFT JOIN public.cost_items ci_util 
  ON ci_util.item = 'Electricity Bill (2 BHK Average)'
LEFT JOIN public.cost_items ci_net 
  ON ci_net.item = 'High-speed Fiber Internet (100-300 Mbps)'
LEFT JOIN public.cost_items ci_metro 
  ON ci_metro.item = 'Namma Metro Monthly Commute Estimate'
WHERE ci_rent.category = 'Housing'
ORDER BY estimated_fixed_monthly_cost DESC;

-- ------------------------------------------------------------------------------
-- 3. AVERAGE RENT BY BHK ACROSS LOCALITIES
-- ------------------------------------------------------------------------------
SELECT 
  area,
  MAX(CASE WHEN item LIKE '1 BHK%' THEN avg_price END) AS rent_1bhk,
  MAX(CASE WHEN item LIKE '2 BHK%' THEN avg_price END) AS rent_2bhk,
  MAX(CASE WHEN item LIKE '3 BHK%' THEN avg_price END) AS rent_3bhk
FROM public.cost_items
WHERE category = 'Housing'
GROUP BY area
ORDER BY rent_2bhk DESC NULLS LAST;

-- ------------------------------------------------------------------------------
-- 4. REAL ESTATE PRICE PER SQUARE FOOT BY LOCALITY
-- ------------------------------------------------------------------------------
SELECT
  location,
  property_type,
  COUNT(*) AS total_listings,
  ROUND(AVG(price / area), 2) AS avg_price_per_sqft,
  ROUND(AVG(price / 10000000.0), 2) AS avg_price_in_crores,
  MIN(ROUND(price / 100000.0, 2)) AS min_price_in_lakhs,
  MAX(ROUND(price / 100000.0, 2)) AS max_price_in_lakhs
FROM public.real_estate
GROUP BY location, property_type
ORDER BY avg_price_per_sqft DESC;

-- ------------------------------------------------------------------------------
-- 5. TOP-RATED RESTAURANTS IN BENGALURU BY NEIGHBORHOOD
-- ------------------------------------------------------------------------------
-- Filters top restaurants with a high vote count for reliability.
SELECT 
  name,
  location,
  rating,
  votes,
  cost_for_two,
  cuisines,
  rest_type
FROM public.restaurants
WHERE rating >= 4.3 AND votes > 5000
ORDER BY rating DESC, votes DESC;

-- ------------------------------------------------------------------------------
-- 6. BUDGET-FRIENDLY EATERIES (Meal for 2 under ₹500)
-- ------------------------------------------------------------------------------
SELECT 
  name,
  location,
  cost_for_two,
  rating,
  cuisines
FROM public.restaurants
WHERE cost_for_two <= 500
ORDER BY rating DESC NULLS LAST, cost_for_two ASC;

-- ------------------------------------------------------------------------------
-- 7. USER BUDGET VS ACTUAL EXPENSE MONITOR (Alert on Overspend)
-- ------------------------------------------------------------------------------
-- Used by the backend Express API to compute budget health for an authenticated user.
-- (Replace '<USER_UUID>' with a valid user id from auth.users or profiles)
/*
SELECT 
  b.category,
  b.limit_amount AS monthly_budget,
  COALESCE(SUM(e.amount), 0) AS total_spent,
  (b.limit_amount - COALESCE(SUM(e.amount), 0)) AS remaining_budget,
  ROUND((COALESCE(SUM(e.amount), 0) / b.limit_amount * 100), 2) AS percentage_used,
  CASE 
    WHEN COALESCE(SUM(e.amount), 0) > b.limit_amount THEN 'OVER_BUDGET'
    WHEN COALESCE(SUM(e.amount), 0) >= (b.limit_amount * 0.85) THEN 'WARNING_THRESHOLD'
    ELSE 'HEALTHY'
  END AS status
FROM public.budgets b
LEFT JOIN public.expenses e 
  ON b.user_id = e.user_id 
  AND b.category = e.category
  AND e.created_at >= date_trunc('month', CURRENT_DATE)
WHERE b.user_id = '<USER_UUID>'
GROUP BY b.category, b.limit_amount;
*/

-- ------------------------------------------------------------------------------
-- 8. RECENT CROWDSOURCED COST CONTRIBUTIONS
-- ------------------------------------------------------------------------------
-- Fetches the latest crowdsourced price submissions for moderation or live feeds.
SELECT 
  id,
  category,
  item,
  avg_price,
  unit,
  area,
  source,
  created_at
FROM public.cost_items
WHERE source = 'crowdsourced'
ORDER BY created_at DESC
LIMIT 20;
