const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) 
            return res.status(400).json({ message: 'User already exists' });

        user = new User({
            email, 
            password: await bcrypt.hash(password, 10) 
        });
        await user.save();

        const token = jwt.sign({ 
            userId: user._id 
        }, process.env.JWT_SECRET, 
        { 
            expiresIn: '7d' 
        });
        res.status(201).json({ 
            token, 
            user: { 
                id: user._id,
                email 
            } 
        });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) 
            return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ 
            userId: user._id 
        }, process.env.JWT_SECRET, 
        { 
            expiresIn: '7d' 
        });
        res.json({ 
            token, 
            user: { 
                id: user._id,
                email 
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
