const express = require('express');
const router = express.Router();
const Chicken = require('../models/Chicken');

// GET all chickens
router.get('/', async (req, res) => {
  const chickens = await Chicken.find();
  res.json(chickens);
});

// POST new chicken
router.post('/', async (req, res) => {
  try {
    const chicken = new Chicken(req.body);
    const saved = await chicken.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
