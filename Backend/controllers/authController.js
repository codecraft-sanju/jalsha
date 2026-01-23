const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Login User (Admin/Manager/Driver)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });

    // 🔥🔥🔥 AUTO-CREATE ADMIN LOGIC (Start) 🔥🔥🔥
    // Agar user nahi mila, aur email 'admin@jalsa.com' hai, toh naya bana do
    if (!user && email === 'admin@jalsa.com') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Default Password
        
        user = new User({
            name: 'Super Admin',
            email: 'admin@jalsa.com',
            password: hashedPassword,
            role: 'Admin'
        });
        
        await user.save();
        console.log("🆕 Admin Auto-Created in Database!");
    }
    // 🔥🔥🔥 AUTO-CREATE ADMIN LOGIC (End) 🔥🔥🔥

    // Agar ab bhi user nahi hai (matlab koi aur email tha), toh error do
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Create Token with Role
    const payload = {
      user: {
        id: user._id,
        role: user.role // 'Admin', 'Manager', etc.
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { loginUser };