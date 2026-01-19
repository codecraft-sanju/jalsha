const jwt = require('jsonwebtoken');

// @desc    Auth Admin & Get Token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  // 1. Validate request
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // 2. Check credentials from .env
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    
    // 3. Create JWT Payload
    const payload = {
      user: {
        role: 'admin'
      }
    };

    // 4. Sign Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ 
            token, 
            msg: 'Admin Login Successful' 
        });
      }
    );
  } else {
    return res.status(400).json({ msg: 'Invalid Credentials' });
  }
};

module.exports = {
  loginAdmin
};