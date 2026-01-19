const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0, // Negative means dealer owes you money
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