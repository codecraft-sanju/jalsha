const express = require('express');
const router = express.Router();
const { submitApplication, getApplications, updateStatus } = require('../controllers/applicationController');
const auth = require('../middleware/authMiddleware'); 

// Public: Submit form
router.post('/', submitApplication);

// ✅ UPDATE: Yahan se 'auth' hata diya hai. Ab logic controller handle karega.
router.get('/', getApplications);

// Private (Admin Only): Update Status (Isme auth rehne do)
router.put('/:id', auth, updateStatus);

module.exports = router;