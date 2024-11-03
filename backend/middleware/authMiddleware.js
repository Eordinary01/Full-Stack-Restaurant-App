const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req, res, next) => {
  // Get token 
  const token = req.header('x-auth-token');

  // Check if no token is present
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    // Check if token has expired
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: 'Token has expired, please log in again' });
    }

    // Attach user info to the request
    req.user = decoded;
    next();
  } catch (error) {
    // Handle invalid token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }

    // Handle other errors, e.g., token expiration issues
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
