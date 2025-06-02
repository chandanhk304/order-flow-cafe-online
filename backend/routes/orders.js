
const express = require('express');
const router = express.Router();

// Mock data store
let orders = [];

// Get orders for a cafe
router.get('/cafe/:cafeId', (req, res) => {
  try {
    const cafeOrders = orders.filter(order => order.cafeId === req.params.cafeId);
    res.json(cafeOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create new order
router.post('/', (req, res) => {
  try {
    const { cafeId, customerName, tableNumber, items, total, paymentMethod } = req.body;
    
    if (!cafeId || !customerName || !tableNumber || !items || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = {
      id: Math.random().toString(36).substr(2, 9),
      cafeId,
      customerName,
      tableNumber,
      items,
      total: parseFloat(total),
      paymentMethod: paymentMethod || 'cash',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.patch('/:id', (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    orders[orderIndex] = { ...orders[orderIndex], ...req.body };
    res.json(orders[orderIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
