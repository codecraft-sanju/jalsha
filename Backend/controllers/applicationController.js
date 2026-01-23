const Application = require('../models/Application');

// 1. Submit New Application (Public Route)
exports.submitApplication = async (req, res) => {
  try {
    const { name, shopName, mobile, city, volume } = req.body;

    // Check duplicate (Agar same mobile se pehle request aayi ho)
    const existing = await Application.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ msg: 'Application already received from this number.' });
    }

    const newApp = new Application({
      name,
      shopName,
      mobile,
      city,
      volume
    });

    await newApp.save();
    res.status(201).json({ msg: 'Application submitted successfully!', id: newApp._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// 2. Get All Applications (Admin Only)
exports.getApplications = async (req, res) => {
  try {
    // Sort by Newest first
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// 3. Update Status (e.g., New -> Contacted -> Approved)
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