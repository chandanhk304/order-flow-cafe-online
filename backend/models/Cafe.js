
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Food' },
  available: { type: Boolean, default: true }
}, { timestamps: true });

const cafeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  menu: [menuItemSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Cafe', cafeSchema);
