const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// Get budget status
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Check budget thresholds for a user
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
