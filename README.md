# Bengaluru Cost Explorer

An interactive React dashboard for exploring cost-of-living signals across Bengaluru. The app combines crowdsourced-style cost data, neighborhood filters, charts, a lifestyle calculator, restaurant search, real-estate browsing, and a 3D category breakdown.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui components
- React Router
- Recharts and Three.js
- Express API server
- DuckDB for querying local CSV datasets
- Supabase client integration for contributed cost items

## Features

- Dashboard with cost summaries, category charts, recent contributions, and draggable widgets
- Interactive 3D category breakdown with click-to-filter behavior
- Neighborhood filtering for cost data
- Restaurant explorer backed by the local Zomato CSV dataset
- Real-estate explorer backed by the local house prices CSV dataset
- Lifestyle calculator for estimating monthly expenses
- Analytics and area comparison pages

## Project Structure

```text
src/                  React app source
src/components/       Shared UI and dashboard components
src/pages/            Route-level pages
src/integrations/     Supabase client and generated types
server/               Express API and CSV query endpoints
csv/                  Local datasets used by DuckDB
public/               Static public assets
supabase/             Supabase project files and migrations
```

## Environment Variables

Copy `.env.example` to `.env` and fill in local values:

```bash
cp .env.example .env
```

Required variables:

```text
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
VITE_API_URL=http://localhost:3001/api
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit `.env`. If real Supabase keys were ever committed, rotate them in Supabase before using this project publicly.

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend and API server together:

```bash
npm run dev
```

The Vite app runs on:

```text
http://localhost:8080
```

The Express API runs on:

```text
http://localhost:3001
```

Vite proxies `/api/*` requests to the Express server.

## Useful Scripts

```bash
npm run dev       # Start Vite and the Express API server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

## Data Notes

The dashboard currently uses a mix of local fallback cost data, Supabase-backed contributed items, and local CSV datasets queried through DuckDB. For production use, add a clear `last_updated` field or data version in the UI so users can judge freshness.

## Security Notes

- `.env` is ignored and should remain local only.
- Supabase anon keys are safe to use in the browser only when Row-Level Security policies are configured correctly.
- Service role keys must never be exposed to frontend code.
- Prefer one clear data-access pattern long term: either a Backend-for-Frontend API boundary or a Supabase-first architecture with documented RLS policies.
