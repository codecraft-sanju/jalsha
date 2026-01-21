const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true, // e.g., "#ORD-992"
  },
  // Agar guest user hai toh naam, agar dealer hai toh ID link karenge
  dealerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dealer',
    default: null 
  },
  customerName: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      size: String,
      quantity: Number, 
      priceAtPurchase: Number 
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);