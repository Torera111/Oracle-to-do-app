const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        return res.status(401).json({ message: "Access denied. No token provided."});
    }

    if (process.env.NODE_ENV !== 'production') console.log('Authenticating token...');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
        if (err){
            if (process.env.NODE_ENV !== 'production') console.log('Token verification failed:', err && err.message);
            return res.status(403).json({ message: "Invalid token."});
        }
        if (process.env.NODE_ENV !== 'production') console.log('Token verified. Payload:', user);
        req.user = user;
        next();
    });
}
module.exports = { authenticateToken};