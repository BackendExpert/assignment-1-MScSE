const tokens = require('../utils/tokens/generateToken');
const User = require('../models/user.model');

async function requireAuth(req, res, next) {
    try {
        const header = req.header('Authorization');
        if (!header) return res.status(401).json({ message: 'No token' });
        const token = header.replace('Bearer ', '');
        const decoded = tokens.verify(token);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Invalid token' });
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { requireAuth };
