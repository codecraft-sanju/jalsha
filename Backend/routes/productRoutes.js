const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/authMiddleware'); // Ensure file exists
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

// Public Route
router.get('/', getProducts);

// Admin Routes (Protected)
router.post('/', verifyAdmin, createProduct); 
router.put('/:id', verifyAdmin, updateProduct); 
router.delete('/:id', verifyAdmin, deleteProduct); 

module.exports = router;