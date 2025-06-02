
const express = require('express');
const router = express.Router();

// Mock data store
let menuItems = [];

// Get menu for a cafe
router.get('/:cafeId', (req, res) => {
  try {
    const cafeMenu = menuItems.filter(item => item.cafeId === req.params.cafeId);
    res.json(cafeMenu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Add menu item
router.post('/:cafeId', (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const menuItem = {
      id: Math.random().toString(36).substr(2, 9),
      cafeId: req.params.cafeId,
      name,
      price: parseFloat(price),
      description: description || '',
      category: category || 'Food',
      available: true,
      createdAt: new Date().toISOString()
    };

    menuItems.push(menuItem);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// Update menu item
router.put('/:cafeId/:itemId', (req, res) => {
  try {
    const itemIndex = menuItems.findIndex(
      item => item.id === req.params.itemId && item.cafeId === req.params.cafeId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    menuItems[itemIndex] = { ...menuItems[itemIndex], ...req.body };
    res.json(menuItems[itemIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item
router.delete('/:cafeId/:itemId', (req, res) => {
  try {
    const itemIndex = menuItems.findIndex(
      item => item.id === req.params.itemId && item.cafeId === req.params.cafeId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    menuItems.splice(itemIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports = router;
