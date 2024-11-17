const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    // Log incoming request details
    console.log('Auth Check:', {
      path: req.path,
      method: req.method,
      headers: {
        authorization: req.header('Authorization')?.substring(0, 20) + '...' // Log partial token for security
      }
    });

    // Check for authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('Missing Authorization header');
      return res.status(401).json({ 
        success: false,
        message: 'Authorization header missing' 
      });
    }

    // Validate Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid token format - missing Bearer prefix');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authorization format. Expected Bearer token' 
      });
    }

    // Extract and verify token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('Empty token after Bearer prefix');
      return res.status(401).json({ 
        success: false,
        message: 'Token is empty' 
      });
    }

    // Verify JWT secret is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured in environment');
      return res.status(500).json({ 
        success: false,
        message: 'Server authentication configuration error' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded token structure
    if (!decoded.userId) {
      console.log('Token missing userId:', decoded);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token structure' 
      });
    }

    // Log successful decode
    console.log("Token verified successfully:", {
      userId: decoded.userId,
      role: decoded.role,
      expires: new Date(decoded.exp * 1000).toISOString()
    });

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email // if you have it in the token
    };

    next();
  } catch (error) {
    // Handle specific JWT errors
    console.error('Auth Error:', {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    switch (error.name) {
      case 'TokenExpiredError':
        return res.status(401).json({ 
          success: false,
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });

      case 'JsonWebTokenError':
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token format',
          code: 'INVALID_TOKEN'
        });

      case 'NotBeforeError':
        return res.status(401).json({ 
          success: false,
          message: 'Token not yet active',
          code: 'TOKEN_NOT_ACTIVE'
        });

      default:
        return res.status(401).json({ 
          success: false,
          message: 'Authentication failed',
          code: 'AUTH_FAILED'
        });
    }
  }
};