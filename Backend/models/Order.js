const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, 
  
  dealerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dealer',
    default: null 
  },
  
  customerName: { type: String, required: true },
  
  // ✅ NEW UPDATE: Ye field add karo
  customerMobile: { 
    type: String, 
    required: true, 
    index: true // Fast searching ke liye index zaroori hai
  },

  shippingAddress: { type: String }, 

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      size: String,
      quantity: Number, 
      priceAtPurchase: Number 
    }
  ],

  totalAmount: { type: Number, required: true },

  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },

  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid', 'Credit'], 
    default: 'Unpaid'
  },
  
  paidAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);