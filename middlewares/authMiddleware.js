const jwt = require('jsonwebtoken'); 
const JWT_SECRET = "aSecret"; 
 
const authMiddleware = (req, res, next) => { 
    const token = req.headers['authorization']; 
 
    if (!token) { 
        return res.status(403).send('Token is required'); 
    } 
 
    jwt.verify(token, JWT_SECRET, (err, user) => { 
        if (err) { 
            return res.status(403).send('Invalid token'); 
        } 
        req.user = user; 
        next(); 
    }); 
}; 
 
module.exports = authMiddleware; 
 