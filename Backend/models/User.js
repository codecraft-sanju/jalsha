const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String }, // Driver contact ke liye
  password: { type: String, required: true },
  
  role: { 
    type: String, 
    enum: ['Admin', 'Manager', 'Driver'], 
    default: 'Admin' 
  },
  
  isActive: { type: Boolean, default: true } // Employee chhod ke jaye toh block kar sakei
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);