
const express = require('express');
const Cafe = require('../models/Cafe');
const router = express.Router();

// Get all cafes
router.get('/', async (req, res) => {
  try {
    const cafes = await Cafe.find({ isActive: true }).select('-menu');
    res.json(cafes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cafes' });
  }
});

// Get cafe by ID
router.get('/:cafeId', async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.cafeId);
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }
    res.json(cafe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cafe' });
  }
});

// Create new cafe
router.post('/', async (req, res) => {
  try {
    const { name, ownerEmail, address, phone } = req.body;
    
    if (!name || !ownerEmail) {
      return res.status(400).json({ error: 'Name and owner email are required' });
    }

    const cafe = new Cafe({
      name,
      ownerEmail,
      address: address || '',
      phone: phone || '',
      menu: []
    });

    const savedCafe = await cafe.save();
    res.status(201).json(savedCafe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cafe' });
  }
});

// Update cafe
router.put('/:cafeId', async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(
      req.params.cafeId,
      req.body,
      { new: true }
    );
    
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }
    
    res.json(cafe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cafe' });
  }
});

// Delete cafe
router.delete('/:cafeId', async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(
      req.params.cafeId,
      { isActive: false },
      { new: true }
    );
    
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cafe' });
  }
});

module.exports = router;
