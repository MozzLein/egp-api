const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    const token = req.get('Authorization');
    
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).redirect('/login');
        }
        
        req.user = decoded.user;
        next();
    });
};
