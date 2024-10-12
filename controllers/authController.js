const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

        // Check for user by either username or email
    const user = await User.findOne({ 
        $or: [{ username: email }, { email: email }] 
    });	
    //const user = await User.findOne({ email });
    console.log("User found:", user); // Log the found user

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid username/email or password' });
    }
};

exports.protectedRoute = (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route' });
};
