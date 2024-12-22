const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {protect} = require('../middlewares/authMiddleware');

router.post('/register', async (req, res) => {
    try{
        const { name, email, password} = req.body;
    
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists!' });
    }
    
    
    const role = 'user';
    // Create new user with hashed password
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    
    // Return response
    res.json({ 
        message: `User ${user.name} registered successfully!`, 
        timestamp: new Date() 
    });
    
    
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials!' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials!' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name , role: user.role}, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );
        

        res.json({ 
            message: 'Login successful!', 
            token, 
            timestamp: new Date() 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/profile' , protect , async (req , res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;