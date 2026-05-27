const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, color }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
