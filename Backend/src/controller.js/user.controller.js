const {catchAsyncError} = require('../middlewares/catchAsyncError.middleware');
const { generateToken } = require('../utils/jwt.token');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

exports.signup = catchAsyncError(async(req, res,next) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        })
    }

    if(password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long'
        })
    }

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User with this email already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        avatar: {
            public_id: 'sample_id',
            url: 'sample_url'
        }
    });

    generateToken(newUser, 'User created successfully', 201, res);

    
})

exports.signin = catchAsyncError(async(req, res,next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        })
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        })
    }

    generateToken(user, 'User signed in successfully', 200, res);
})

exports.signout = catchAsyncError(async(req, res,next) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development' ? true : false,
        sameSite: 'strict'
    });

    return res.status(200).json({
        success: true,
        message: 'User signed out successfully'
    });
})

exports.getUser = catchAsyncError(async(req, res,next) => {
    const user = await User.findById(req.user._id).select('-password -__v');
    res.status(200).json({
        success: true,
        user
    });
})

exports.updateProfile = catchAsyncError(async(req, res,next) => {
    const {username, email} = req.body;
    if(!username || !email) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        })
    }

    const avatar = req?.files?.avatar;
    let cloudinaryResponse = {};

    if(avatar) {
        try {
            const oldAvatarPublicId = req.user?.avatar?.public_id;
            if(oldAvatarPublicId) {
                await cloudinary.uploader.destroy(oldAvatarPublicId);
            }
            cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
                folder: 'ChatApp/avatars',
                transformation: [
                    { width: 150, height: 150, crop: 'limit' },
                    { quality: 'auto'}, {fetch_format: 'auto' }
                ]
            });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error uploading Profile picture, please try again later'
            });
        }
    }

    let data ={
        username,
        email
    }

    if(avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url) {
        data.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }

    let user = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true
    }).select('-password -__v');

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user
    });
})
