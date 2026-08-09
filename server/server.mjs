import express from 'express';
import cors from 'cors';
import { resolve } from 'path';

const app = express();
const port = 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:8080' }));
app.use(express.json());

// No DB initialized

const fallbackRestaurants = [
  { name: "CTR Shri Sagar", address: "7th Cross Road, Malleswaram", location: "Malleswaram", rating: 4.6, votes: 12480, cost_for_two: 250, cuisines: "South Indian, Breakfast", rest_type: "Quick Bites" },
  { name: "Meghana Foods", address: "Koramangala 5th Block", location: "Koramangala", rating: 4.4, votes: 18930, cost_for_two: 700, cuisines: "Biryani, Andhra, North Indian", rest_type: "Casual Dining" },
  { name: "Toit", address: "100 Feet Road, Indiranagar", location: "Indiranagar", rating: 4.5, votes: 21500, cost_for_two: 2000, cuisines: "Continental, Pizza, Beverages", rest_type: "Pub" },
  { name: "Rameshwaram Cafe", address: "JP Nagar and Indiranagar", location: "Indiranagar", rating: 4.3, votes: 9800, cost_for_two: 300, cuisines: "South Indian, Snacks", rest_type: "Quick Bites" },
  { name: "Truffles", address: "80 Feet Road, Koramangala", location: "Koramangala", rating: 4.2, votes: 15420, cost_for_two: 900, cuisines: "Cafe, Burgers, Continental", rest_type: "Cafe" },
  { name: "Windmills Craftworks", address: "Whitefield Main Road", location: "Whitefield", rating: 4.4, votes: 7340, cost_for_two: 2500, cuisines: "Continental, North Indian, Craft Beer", rest_type: "Microbrewery" },
];

const fallbackProperties = [
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

const filterByLocation = (items, area = '') => {
  const queryText = String(area).trim().toLowerCase();
  if (!queryText) return items;
  return items.filter((item) => item.location.toLowerCase().includes(queryText));
};

const paginate = (items, limit = 50, page = 1) => {
  const size = Number(limit);
  const start = (Number(page) - 1) * size;
  return items.slice(start, start + size);
};



// Endpoints
app.get('/api/restaurants', (req, res) => {
  const { area, limit = 50, page = 1 } = req.query;
  res.json(paginate(filterByLocation(fallbackRestaurants, area), limit, page));
});

app.get('/api/real-estate', (req, res) => {
  const { area, limit = 50, page = 1 } = req.query;
  res.json(paginate(filterByLocation(fallbackProperties, area), limit, page));
});

// Serve static frontend assets if dist folder exists
const distPath = resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(resolve(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

const server = app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Backend server failed to start:', error);
  process.exit(1);
});
