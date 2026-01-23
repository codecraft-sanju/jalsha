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
    
    // 🔥 CHANGE: 'req.admin' ki jagah 'req.user' karein
    // Kyunki humne token banate waqt payload me { user: ... } rakha tha
    req.user = decoded.user; 
    
    // Optional: Check karein ki user sach me Admin hai ya nahi
    // if (req.user.role !== 'admin' && req.user.role !== 'Admin') {
    //    return res.status(403).json({ msg: 'Access denied. Admins only.' });
    // }

    next(); // Aage badho (Controller ke paas jao)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyAdmin;