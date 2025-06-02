
const express = require('express');
const Order = require('../models/Order');
const Cafe = require('../models/Cafe');
const router = express.Router();

// Get orders for a cafe
router.get('/cafe/:cafeId', async (req, res) => {
  try {
    const orders = await Order.find({ cafeId: req.params.cafeId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('cafeId', 'name address phone');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { cafeId, items, customerName, tableNumber, paymentMethod } = req.body;
    
    if (!cafeId || !items || !customerName || !tableNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const order = new Order({
      cafeId,
      items,
      totalAmount,
      customerName,
      tableNumber,
      paymentMethod: paymentMethod || 'cash'
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Update payment status
router.put('/:orderId/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const validStatuses = ['pending', 'completed', 'failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { paymentStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

module.exports = router;
