const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g., "1 Litre", "500ml"
  img: { type: String, required: true }, // Image URL
  
  crateSize: { type: Number, required: true }, // 1 Carton/Peti mein kitni bottles hain
  
  pricePerCrate: { type: Number, required: true }, // 1 Carton ka Regular Rate
  costPrice: { type: Number }, // Aapko kitne me padta hai (Profit nikalne ke liye)

  // ✅ DISCOUNT SYSTEM (Wholesale Rate)
  bulkThreshold: { 
    type: Number, 
    default: 100, // Agar dealer 100+ Peti (Cartons) leta hai...
    help: "Minimum cartons for wholesale rate"
  },
  bulkPrice: { 
    type: Number, 
    default: 0, // ...toh rate yeh lagega (e.g. 90 ki jagah 85)
    help: "Discounted price per carton"
  },

  stock: { type: Number, default: 0 }, // Total Cartons in Factory
  lowStockThreshold: { type: Number, default: 50 }, // Warning level

  desc: { type: String }, // e.g. "Wedding Special"
  tag: { type: String }, 
  
  isAvailable: { type: Boolean, default: true } 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);