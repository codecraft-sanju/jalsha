const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Owner Name
  shopName: { type: String, required: true }, // Shop/Agency Name
  
  location: { type: String, required: true }, // City/Area
  address: { type: String }, // Full Address
  
  mobile: { type: String, required: true, unique: true },
  gstin: { type: String }, // GST for Invoice (Optional)

  // 💰 MONEY LEDGER (Sirf Paisa Track Hoga)
  balance: { type: Number, default: 0 }, // Positive = Dealer ne dena hai (Udhaar)

  // 🔥 TRANSACTION HISTORY (Paisa aaya ya maal gaya)
  transactions: [
    {
      date: { type: Date, default: Date.now },
      amount: { type: Number, required: true },
      type: { 
        type: String, 
        enum: ['Debit', 'Credit'], 
        required: true 
      }, 
      // Debit = Maal khareeda (Udhaar Badha)
      // Credit = Payment ki (Udhaar Ghata)
      
      description: { type: String } // e.g., "Invoice #101" or "PhonePe Received"
    }
  ],

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);