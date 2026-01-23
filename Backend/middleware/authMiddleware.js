const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  // 1. Header se token nikalo
  const token = req.header('x-auth-token');

  // 2. Agar token nahi hai
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Token verify karo
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 🔥 Correct: 'req.user' set kar rahe hain jo controller me match karega
    req.user = decoded.user; 
    
    next(); // Aage badho
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyAdmin;