const { catchAsyncError } = require("./catchAsyncError.middleware");
const jwt = require("jsonwebtoken");
const User = require('../models/user.model');



exports.isauthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized, please sign in'
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token, please sign in again'
        });
    }

    req.user = await User.findById(decoded.id);
    next();
});

