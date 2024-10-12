const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get Token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and attach to req object
            req.user = await User.findById(decoded.id).select('-password');

            // Proceed to the next middleware
            return next(); // Use return to stop further code execution
        } catch (error) {
            // Invalid token, send error response
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token found, send error response
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { protect, admin };