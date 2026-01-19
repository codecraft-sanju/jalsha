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

// Admin: View all orders & Change status
router.get('/', verifyAdmin, getAllOrders);
router.put('/:id', verifyAdmin, updateOrderStatus);

module.exports = router;