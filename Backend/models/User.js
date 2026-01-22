
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { 
    type: String, 
    enum: ['Admin', 'Manager', 'Driver'], 
    default: 'Admin' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);