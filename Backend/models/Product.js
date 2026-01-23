const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  size: { type: String, required: true }, // "1 Litre"
  img: { type: String, required: true },
  
  crateSize: { type: Number, required: true }, // 12 bottles
  
  pricePerCrate: { type: Number, required: true }, // Selling Price
  costPrice: { type: Number }, // Profit calculate karne ke liye (Optional but Good)

  stock: { type: Number, default: 0 },
  
  // 🔥 New: Kab warning dikhani hai? (e.g., jab 50 crates bachein)
  lowStockThreshold: { type: Number, default: 50 }, 

  desc: { type: String },
  tag: { type: String }, // "Best Seller"
  
  isAvailable: { type: Boolean, default: true } // Stock 0 hone par bhi hide/show karne ke liye
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);