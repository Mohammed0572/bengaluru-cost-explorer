const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// Get all expenses (example of server-side data fetching)
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// Secure endpoint example: Calculate budgets and generate a report
router.post('/calculate-budget', async (req, res, next) => {
  try {
    // In a real app, this would perform complex calculations or trigger an email
    // that you wouldn't want running purely on the client side.
    const { userId } = req.body;
    
    // Simulate complex calculation
    res.json({ 
      success: true, 
      message: 'Budget calculation completed successfully.',
      report: { status: 'Generated' }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
