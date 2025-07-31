const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.generateToken = async(user, message,statusCode,res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    });

    return res.status(statusCode).cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development' ? true : false,
        sameSite: 'strict',
        maxAge: process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000 
    }).json({
        success: true,
        message,
        username: user.username,
        token
    });
}