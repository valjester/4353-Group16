const jwt = require('jsonwebtoken');
const User = require('../models/User');

//This function authenticates the user's login session via the login token.
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Access denied: Invalid token' });
    }
    req.user = user;
    console.log("USER VERIFIED!");
    console.log(req.user);
    next();
  });
};

//This function ensures only users with the admin role can access the Admin page.
const protectAdminRoute = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied.' });
  }
};

module.exports = { authenticateToken, protectAdminRoute };
