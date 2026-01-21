const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Owner Name
  },
  shopName: {
    type: String, 
    required: true, // Agency/Shop Name (Added this)
  },
  location: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true, // Mobile number unique hona chahiye duplicate entry rokne ke liye
  },
  balance: {
    type: Number,
    default: 0, // Negative (-) means dealer has to pay you (Udhaar)
  },
  lastPaymentDate: {
    type: Date,
    default: Date.now,
  },
  lastPaymentAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);