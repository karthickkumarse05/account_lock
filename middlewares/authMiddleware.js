const jwt = require('jsonwebtoken')
const User = require('../models/user')


const authorize = async (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) return res.status(401).json({ message: "No token provided." })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        if (!req.user) return res.status(401).json({ message: 'Invalid token.' })
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token Is invalid or expired' })
    }
}


module.exports = authorize