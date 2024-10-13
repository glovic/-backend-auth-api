// server.js
const express = require('express');
const dotenv = require('dotenv');
//const mongoose = require('mongoose'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

