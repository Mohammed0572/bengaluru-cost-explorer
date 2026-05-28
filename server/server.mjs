import express from 'express';
import cors from 'cors';
import duckdb from 'duckdb';
const { Database } = duckdb;
import { resolve } from 'path';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize DuckDB
const db = new Database(':memory:');

// Helper to query DuckDB
const query = (sql) => {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

// Endpoints
app.get('/api/restaurants', async (req, res) => {
  try {
    const { area, minRating = 4.0, limit = 50, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    // We will query directly from the CSV using duckdb read_csv_auto
    // Note: Zomato ratings are formatted like '4.1/5', so we need to parse them.
    // We'll also do a basic ILIKE search if area is provided.
    
    let areaFilter = '';
    if (area) {
        areaFilter = `WHERE location ILIKE '%${area.replace(/'/g, "''")}%' OR address ILIKE '%${area.replace(/'/g, "''")}%'`;
    }

    const sql = `
      SELECT 
        name, 
        address, 
        location,
        TRY_CAST(SPLIT_PART(rate, '/', 1) AS DOUBLE) as rating,
        CAST(votes AS INTEGER) as votes,
        TRY_CAST(REPLACE(REPLACE("approx_cost(for two people)", ',', ''), '₹', '') AS DOUBLE) as cost_for_two,
        cuisines,
        rest_type
      FROM read_csv_auto('csv/zomato.csv')
      ${areaFilter}
      ORDER BY rating DESC NULLS LAST, votes DESC NULLS LAST
      LIMIT ${Number(limit)} OFFSET ${offset};
    `;
    
    const data = await query(sql);
    res.json(data);
  } catch (error) {
    console.error('Error querying restaurants:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/real-estate', async (req, res) => {
  try {
    const { area, type, limit = 50, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let filters = [];
    if (area) {
        filters.push(`location ILIKE '%${area.replace(/'/g, "''")}%'`);
    }
    if (type) {
        filters.push(`property_type = '${type.replace(/'/g, "''")}'`);
    }
    
    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const sql = `
      SELECT *
      FROM read_csv_auto('csv/house_prices_bangalore.csv')
      ${whereClause}
      ORDER BY CAST(price AS DOUBLE) DESC
      LIMIT ${Number(limit)} OFFSET ${offset};
    `;
    
    const data = await query(sql);
    res.json(data);
  } catch (error) {
    console.error('Error querying real estate:', error);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Backend server failed to start:', error);
  process.exit(1);
});
