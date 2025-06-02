
const express = require('express');
const router = express.Router();

// Mock data store (replace with MongoDB in production)
let cafes = [];

// Create a new cafe
router.post('/', (req, res) => {
  try {
    const { name, ownerEmail } = req.body;
    
    if (!name || !ownerEmail) {
      return res.status(400).json({ error: 'Name and owner email are required' });
    }

    const cafe = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      ownerEmail,
      menu: [],
      orders: [],
      createdAt: new Date().toISOString()
    };

    cafes.push(cafe);
    res.status(201).json(cafe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cafe' });
  }
});

// Get cafe by ID
router.get('/:id', (req, res) => {
  try {
    const cafe = cafes.find(c => c.id === req.params.id);
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }
    res.json(cafe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cafe' });
  }
});

// Update cafe
router.put('/:id', (req, res) => {
  try {
    const cafeIndex = cafes.findIndex(c => c.id === req.params.id);
    if (cafeIndex === -1) {
      return res.status(404).json({ error: 'Cafe not found' });
    }

    cafes[cafeIndex] = { ...cafes[cafeIndex], ...req.body };
    res.json(cafes[cafeIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cafe' });
  }
});

module.exports = router;
