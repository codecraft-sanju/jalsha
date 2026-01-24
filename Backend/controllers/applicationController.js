const Application = require('../models/Application');
const jwt = require('jsonwebtoken'); // ✅ Ye zaroor add karein

// 1. Submit New Application (Public Route)
exports.submitApplication = async (req, res) => {
  try {
    const { name, shopName, mobile, city, volume, gstin } = req.body;

    // Check duplicate
    const existing = await Application.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ msg: 'Application already received from this number.' });
    }

    const newApp = new Application({
      name,
      shopName,
      mobile,
      city,
      volume,
      gstin // Optional field added
    });

    await newApp.save();
    
    // Real-time update for Admin (Socket.io)
    if(req.io) {
        req.io.emit('new_application', newApp);
    }

    res.status(201).json({ msg: 'Application submitted successfully!', id: newApp._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// 2. Get Applications (Hybrid: Public Mobile Search OR Admin List)
exports.getApplications = async (req, res) => {
  try {
    const { mobile } = req.query;

    // ✅ CASE A: Customer Tracking (Public Access via Mobile)
    if (mobile) {
        // Sirf us mobile number ki applications dikhao
        const apps = await Application.find({ mobile }).sort({ createdAt: -1 });
        return res.json(apps);
    }

    // ✅ CASE B: Admin Panel (Requires Token)
    // Kyunki humne Route se 'auth' hata diya, ab humein manual check karna padega
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Agar token sahi hai, toh SAARI applications dikhao
      const apps = await Application.find().sort({ createdAt: -1 });
      res.json(apps);

    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// 3. Update Status (Admin Only)
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    let app = await Application.findById(req.params.id);

    if (!app) return res.status(404).json({ msg: 'Application not found' });

    if (status) app.status = status;
    if (adminNotes) app.adminNotes = adminNotes;

    await app.save();
    res.json(app);

  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};