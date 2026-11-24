-- ==============================================================================
-- BENGALURU COST EXPLORER - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- This script sets up all tables, relations, triggers, indexes, and Row Level
-- Security (RLS) policies for the Bengaluru Cost Explorer project.
--
-- How to apply:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project and navigate to the "SQL Editor" tab.
-- 3. Paste the contents of this script and click "Run".
-- ==============================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. USER PROFILES
-- ==============================================================================
-- Stores user profile data linked with Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 2. COST ITEMS
-- ==============================================================================
-- Stores cost of living items across categories (housing, food, commute, etc.)
-- and Bengaluru localities, including crowdsourced contributions.
CREATE TABLE IF NOT EXISTS public.cost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  min_price NUMERIC(12, 2) DEFAULT 0,
  max_price NUMERIC(12, 2) DEFAULT 0,
  avg_price NUMERIC(12, 2) DEFAULT 0,
  unit TEXT DEFAULT '₹/month',
  area TEXT DEFAULT 'Bengaluru',
  source TEXT DEFAULT 'crowdsourced',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 3. RESTAURANTS
-- ==============================================================================
-- Stores restaurant data across Bengaluru localities, backed by Zomato dataset.
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  location TEXT NOT NULL,
  rating NUMERIC(3, 1),
  votes INTEGER DEFAULT 0,
  cost_for_two NUMERIC(10, 2) DEFAULT 0,
  cuisines TEXT,
  rest_type TEXT,
  source TEXT DEFAULT 'Zomato',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 4. REAL ESTATE
-- ==============================================================================
-- Stores real estate and housing price data across Bengaluru neighborhoods,
-- backed by the 99acres and Bangalore house price datasets.
CREATE TABLE IF NOT EXISTS public.real_estate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area NUMERIC(10, 2) NOT NULL, -- Total property area in sq. ft.
  location TEXT NOT NULL,
  bhk INTEGER NOT NULL,
  bath INTEGER NOT NULL,
  property_type TEXT DEFAULT 'Apartment',
  price NUMERIC(14, 2) NOT NULL, -- Total price in INR
  source TEXT DEFAULT '99acres',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 5. CATEGORIES
-- ==============================================================================
-- Expense & lifestyle budget categories with associated hex color codes.
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 6. USER EXPENSES
-- ==============================================================================
-- Tracks personal expenses logged by authenticated users.
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 7. USER BUDGETS
-- ==============================================================================
-- Tracks category budget limits per authenticated user.
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount NUMERIC(12, 2) NOT NULL,
  period TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_cost_items_area ON public.cost_items (area);
CREATE INDEX IF NOT EXISTS idx_cost_items_category ON public.cost_items (category);
CREATE INDEX IF NOT EXISTS idx_cost_items_created_at ON public.cost_items (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_restaurants_location ON public.restaurants (location);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON public.restaurants (rating DESC);
CREATE INDEX IF NOT EXISTS idx_restaurants_cost ON public.restaurants (cost_for_two ASC);

CREATE INDEX IF NOT EXISTS idx_real_estate_location ON public.real_estate (location);
CREATE INDEX IF NOT EXISTS idx_real_estate_bhk ON public.real_estate (bhk);
CREATE INDEX IF NOT EXISTS idx_real_estate_price ON public.real_estate (price ASC);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses (user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON public.expenses (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets (user_id);

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

-- 1. Automatically update `updated_at` column timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_budgets_updated_at ON public.budgets;
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Automatically create a profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles Policies: Users manage only their own profile
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Cost Items Policies: Public read + Crowdsource contributions
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view cost items" ON public.cost_items;
CREATE POLICY "Public can view cost items"
  ON public.cost_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can contribute cost items" ON public.cost_items;
CREATE POLICY "Anyone can contribute cost items"
  ON public.cost_items FOR INSERT
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- Restaurants Policies: Public read-only
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view restaurants" ON public.restaurants;
CREATE POLICY "Public can view restaurants"
  ON public.restaurants FOR SELECT
  USING (true);

-- ------------------------------------------------------------------------------
-- Real Estate Policies: Public read-only
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view real estate" ON public.real_estate;
CREATE POLICY "Public can view real estate"
  ON public.real_estate FOR SELECT
  USING (true);

-- ------------------------------------------------------------------------------
-- Categories Policies: Public read + Authenticated insert
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create categories" ON public.categories;
CREATE POLICY "Authenticated users can create categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- Expenses Policies: Authenticated users manage their own expenses
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
CREATE POLICY "Users can view their own expenses"
  ON public.expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expenses;
CREATE POLICY "Users can insert their own expenses"
  ON public.expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
CREATE POLICY "Users can update their own expenses"
  ON public.expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;
CREATE POLICY "Users can delete their own expenses"
  ON public.expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Budgets Policies: Authenticated users manage their own budgets
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own budgets" ON public.budgets;
CREATE POLICY "Users can view their own budgets"
  ON public.budgets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own budgets" ON public.budgets;
CREATE POLICY "Users can insert their own budgets"
  ON public.budgets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own budgets" ON public.budgets;
CREATE POLICY "Users can update their own budgets"
  ON public.budgets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own budgets" ON public.budgets;
CREATE POLICY "Users can delete their own budgets"
  ON public.budgets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
