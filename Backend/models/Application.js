const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Form Data (Jo User website par bharega)
  name: { type: String, required: true }, // Owner Name
  shopName: { type: String, required: true }, // Agency/Shop Name
  mobile: { type: String, required: true }, // Contact Number
  city: { type: String, required: true }, // Area/City (e.g., Rani, Falna)
  
  //  NEW FIELD ADDED HERE
  gstin: { type: String }, // GST Number (Optional)

  // Business Potential
  volume: { type: String, required: true }, // e.g., "100 - 500 Crates", "FTL"

  // Admin Tracking Fields
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Approved', 'Rejected'], 
    default: 'New' 
  },
  
  adminNotes: { type: String } 

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);