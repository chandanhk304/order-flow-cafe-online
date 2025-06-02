
const express = require('express');
const Cafe = require('../models/Cafe');
const router = express.Router();

// Get menu for a cafe
router.get('/:cafeId', async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.cafeId);
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }
    res.json(cafe.menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Add menu item
router.post('/:cafeId', async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const menuItem = {
      name,
      price: parseFloat(price),
      description: description || '',
      category: category || 'Food',
      available: true
    };

    const cafe = await Cafe.findById(req.params.cafeId);
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }

    cafe.menu.push(menuItem);
    await cafe.save();

    const addedItem = cafe.menu[cafe.menu.length - 1];
    res.status(201).json(addedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// Update menu item
router.put('/:cafeId/:itemId', async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.cafeId);
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }

    const menuItem = cafe.menu.id(req.params.itemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    Object.assign(menuItem, req.body);
    await cafe.save();

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item
router.delete('/:cafeId/:itemId', async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.cafeId);
    if (!cafe) {
      return res.status(404).json({ error: 'Cafe not found' });
    }

    cafe.menu.id(req.params.itemId).remove();
    await cafe.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports = router;
