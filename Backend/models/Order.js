const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // #ORD-1001
  
  dealerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dealer',
    default: null 
  },
  
  customerName: { type: String, required: true },
  shippingAddress: { type: String }, // Agar delivery location alag ho

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String, // Name save kar lete hain taaki product delete hone par bhi order history me dikhe
      size: String,
      quantity: Number, 
      priceAtPurchase: Number 
    }
  ],

  totalAmount: { type: Number, required: true },

  // 🚚 Logistics Status
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },

  // 💰 Money Status (Bahut Zaroori for Wholesale)
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid', 'Credit'], // Credit means Udhaar khate me jud gaya
    default: 'Unpaid'
  },
  
  paidAmount: { type: Number, default: 0 } // Kitna paisa abhi diya
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);