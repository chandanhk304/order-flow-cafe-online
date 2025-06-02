
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  cafeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  customerName: { type: String, required: true },
  tableNumber: { type: String, required: true },
  paymentMethod: { type: String, enum: ['online', 'upi', 'cash'], required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
