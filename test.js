const { Database } = require('duckdb');
const db = new Database(':memory:');

db.all(`
  SELECT 
    name, 
    address, 
    location,
    TRY_CAST(SPLIT_PART(rate, '/', 1) AS DOUBLE) as rating,
    CAST(votes AS INTEGER) as votes,
    TRY_CAST(REPLACE(REPLACE(approx_cost(for two people), ',', ''), '₹', '') AS DOUBLE) as cost_for_two,
    cuisines,
    rest_type
  FROM read_csv_auto('csv/zomato.csv')
  LIMIT 5;
`, (err, res) => {
  if (err) {
    console.error("DUCKDB ERROR:", err);
  } else {
    console.log("SUCCESS:", res);
  }
});
