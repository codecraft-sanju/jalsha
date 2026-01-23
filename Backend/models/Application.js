const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Form Data (Jo User website par bharega)
  name: { type: String, required: true }, // Owner Name
  shopName: { type: String, required: true }, // Agency/Shop Name
  mobile: { type: String, required: true }, // Contact Number
  city: { type: String, required: true }, // Area/City (e.g., Rani, Falna)
  
  // Business Potential (Important for deciding priority)
  volume: { type: String, required: true }, // e.g., "100 - 500 Crates", "FTL"

  // Admin Tracking Fields (User ko nahi dikhenge)
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Approved', 'Rejected'], 
    default: 'New' 
  },
  
  adminNotes: { type: String } // e.g., "Call kiya tha, rate negotiate kar raha hai"

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);