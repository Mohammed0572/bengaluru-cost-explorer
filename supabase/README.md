# Supabase Database Setup for Bengaluru Cost Explorer

This directory contains the database schema, seed data, and analytical queries for the **Bengaluru Cost Explorer** project.

## Files Overview

| File | Description |
|---|---|
| [`schema.sql`](./schema.sql) | Complete DDL to create all tables, indexes, triggers, and Row Level Security (RLS) policies. |
| [`seed.sql`](./seed.sql) | Realistic sample dataset covering Bengaluru localities (Koramangala, Indiranagar, HSR Layout, Whitefield, etc.), restaurants (Zomato), and real estate (99acres). |
| [`queries.sql`](./queries.sql) | Ready-to-use analytical queries (lifestyle cost estimates, rent comparisons, price/sqft metrics, and budget tracking). |
| [`migrations/`](./migrations/) | Standard migration files applied automatically by the Supabase CLI (`supabase db push`). |

---

## Setup Options

### Option 1: Supabase Web Dashboard (Easiest & Recommended)

1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab from the left navigation.
3. Open [`schema.sql`](./schema.sql), copy its entire content, paste it into the editor, and click **Run**.
4. (Optional) Open [`seed.sql`](./seed.sql), paste into the editor, and click **Run** to populate initial sample data for Bengaluru.
5. You can now use any query from [`queries.sql`](./queries.sql) in the SQL Editor to analyze data.

### Option 2: Supabase CLI

If you have the Supabase CLI installed and linked to your project:

```bash
# 1. Login and link your project (if not already linked)
supabase login
supabase link --project-ref your_project_ref

# 2. Push all migrations to create schema and tables
supabase db push

# 3. (Optional) Seed the database
supabase db execute --file supabase/seed.sql
```

---

## Database Architecture

### Tables

1. **`profiles`**: Linked to `auth.users(id)` with auto-creation trigger on user signup.
2. **`cost_items`**: Categorized living costs (rent, transit, groceries, utilities) by area with crowdsource contribution support.
3. **`restaurants`**: Dining options, ratings, cuisines, and cost for two across Bengaluru.
4. **`real_estate`**: Property listings with BHK, area in sq. ft., property type, and INR price.
5. **`categories`**: Expense/lifestyle categories with hex color branding.
6. **`expenses`**: User-specific expense tracking with RLS isolation.
7. **`budgets`**: User-specific category spending limits and threshold monitoring.

### Row Level Security (RLS)

- **Public Read (`SELECT`)**: `cost_items`, `restaurants`, `real_estate`, and `categories` are publicly queryable by all clients.
- **Crowdsource Insert (`INSERT`)**: Anyone (including anonymous visitors) can contribute cost items via the contribution form.
- **User Isolation**: `profiles`, `expenses`, and `budgets` are strictly isolated to `auth.uid() = user_id`.
