const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true, // e.g., "1 Litre"
  },
  img: {
    type: String,
    required: true, // Image URL path
  },
  crateSize: {
    type: Number,
    required: true, // e.g., 12 bottles per crate
  },
  pricePerCrate: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0, // Factory Stock
  },
  desc: {
    type: String, 
  },
  tag: {
    type: String, // e.g., "Best Seller"
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);