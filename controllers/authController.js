const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const user = await User.create({ username, email, password: hashedPassword });
    
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
    console.log("Login Attempt:", { username: undefined, email, password });

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Successful login
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

exports.protectedRoute = (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route' });
};
