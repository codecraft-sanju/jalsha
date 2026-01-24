const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/authMiddleware'); // Token Checker
const { loginUser, getUser } = require('../controllers/authController');

// Login Route (Public)
router.post('/login', loginUser);

// User Data Route (Protected) - Page Refresh ke liye
router.get('/user', verifyAdmin, getUser);

module.exports = router;