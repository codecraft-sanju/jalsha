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
    req.admin = decoded; // Decoded payload request me jod do
    next(); // Aage badho (Controller ke paas jao)
  } catch (err) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyAdmin;