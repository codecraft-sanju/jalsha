const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/authMiddleware');
const { 
  createOrder, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');

// Public: Customer creates order
router.post('/', createOrder);

// ✅ UPDATE: 'verifyAdmin' hata diya taaki Customer bhi apna order dekh sake
// Logic controller ke andar hai (Mobile number filter)
router.get('/', getAllOrders);

// Admin Only: Change status (Ye secure rahega)
router.put('/:id', verifyAdmin, updateOrderStatus);

module.exports = router;