const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Login User & Auto-Create Admin if not exists
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });

    // 🔥🔥🔥 AUTO-CREATE ADMIN LOGIC (Smart Move!) 🔥🔥🔥
    const adminEmail = process.env.ADMIN_EMAIL; 
    const adminPass = process.env.ADMIN_PASS;   

    // Agar user DB me nahi hai, lekin email .env wala hai -> Admin bana do
    if (!user && email === adminEmail) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPass, salt);
        
        user = new User({
            name: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'Admin'
        });
        
        await user.save();
        console.log(`🆕 Admin (${adminEmail}) Auto-Created in Database!`);
    }
    // 🔥🔥🔥 END LOGIC 🔥🔥🔥

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Create Token
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }, // 24 ghante tak login rahega
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

// @desc    Get Current User (Reload hone par data lane ke liye)
// @route   GET /api/auth/user
const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
};

module.exports = { loginUser, getUser };