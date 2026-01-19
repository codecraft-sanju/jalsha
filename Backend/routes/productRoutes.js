const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/authMiddleware');
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

// Public Route (For Website/App)
router.get('/', getProducts);

// Admin Routes (Protected)
router.post('/', verifyAdmin, createProduct); // Add Stock
router.put('/:id', verifyAdmin, updateProduct); // Update Stock
router.delete('/:id', verifyAdmin, deleteProduct); // Delete Item

module.exports = router;