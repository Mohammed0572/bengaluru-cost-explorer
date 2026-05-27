const express = require('express');
const router = express.Router();
const { z } = require('zod');
const supabase = require('../utils/supabase');
const validate = require('../middleware/validate');

// Zod Schema for input validation
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color code")
});

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err); // Pass error to global error handler
  }
});

// Create a new category with input validation
router.post('/', validate(categorySchema), async (req, res, next) => {
  try {
    // req.body is fully typed and sanitized by Zod
    const { name, color } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, color }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err); // Pass error to global error handler
  }
});

module.exports = router;
