const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Owner Name
  shopName: { type: String, required: true }, // Agency Name
  
  location: { type: String, required: true }, // General Area (e.g., "Mokampura")
  address: { type: String }, // Full Address (Optional)
  
  mobile: { type: String, required: true, unique: true },
  gstin: { type: String }, // GST Number (For Wholesale Bills)

  // Current Balance (Positive = Usne dena hai, Negative = Advance diya hai)
  balance: { type: Number, default: 0 }, 

  // 🔥 KHATA BOOK LOGIC (History of Payments & Orders)
  transactions: [
    {
      date: { type: Date, default: Date.now },
      amount: { type: Number, required: true },
      type: { type: String, enum: ['Debit', 'Credit'], required: true }, // Debit = Maal liya (Balance Badha), Credit = Paisa diya (Balance Ghata)
      description: { type: String } // e.g., "Order #ORD-101" or "Cash Received"
    }
  ],

  isActive: { type: Boolean, default: true } // Agar dealer kaam band kar de
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);