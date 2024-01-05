const JWT = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    const token = (req.cookies && req.cookies.token) || null;
    if (!token) return res.status(400).json({
        success: false,
        message: 'No token provided'
    });

    try {
        const payloaf = JWT.verify(token, process.env.SECRET);
        req.user = {
            id: payloaf.id,
            email: payloaf.email
        };
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token'
        });
    }
    next();
};


module.exports = jwtAuth;