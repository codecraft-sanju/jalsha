// authRoutes.js
const express = require('express');
const router = express.Router();

// 🔥 CHANGE: 'loginAdmin' ki jagah 'loginUser' import karein
const { loginUser } = require('../controllers/authController');

// POST /api/auth/login
// 🔥 CHANGE: Yahan bhi 'loginUser' lagayein
router.post('/login', loginUser);

module.exports = router;