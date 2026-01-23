const express = require('express');
const router = express.Router();
const { submitApplication, getApplications, updateStatus } = require('../controllers/applicationController');
const auth = require('../middleware/auth'); // Tumhara admin auth middleware

// Public: Submit form
router.post('/', submitApplication);

// Private (Admin Only): View list & Update
router.get('/', auth, getApplications);
router.put('/:id', auth, updateStatus);

module.exports = router;