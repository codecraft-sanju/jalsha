const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/authMiddleware');
const { 
  getDealers, 
  createDealer, 
  updateDealerTransaction 
} = require('../controllers/dealerController');

// All Routes are Admin Protected
router.get('/', verifyAdmin, getDealers);
router.post('/', verifyAdmin, createDealer);
router.put('/:id/transaction', verifyAdmin, updateDealerTransaction);

module.exports = router;