const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { register, login, protectedRoute } = require('../controllers/authController');
const User = require('../models/User'); // Assuming you have a User model

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
 console.log('Registration Attempt:', { username, email, password });

  try {
      // Log the request body to confirm it includes the email
    console.log(req.body);

    console.log('Raw Password:', password); // Log the raw password	  
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword); // Log the hashed password

    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login a user
// Login a user
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body; // Accept both username and email

  try {
    console.log("Login Attempt: ", req.body); // Log the incoming request body

    // Search for the user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email }]
    });

    // Check if the user was found
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Debugging log to compare password
    console.log("Comparing password:", password, user.password); // Log the passwords being compared

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch); // Log the result of the comparison

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create and send the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
