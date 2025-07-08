const User = require('../models/User');
const bcrypt = require('bcryptjs');

const UserRegistration = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(422).json({ message: 'All fields are required' });
        }
        if (username.length < 3 || username.length > 50) {
            return res.status(422).json({ message: 'Username must be between 3 and 50 characters' });
        }
        if (password.length < 6 || password.length > 20) {
            return res.status(422).json({ message: 'Password length must be between 6-20' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ message: 'Email and password are required' });
        }

        // Explicitly select the password field using .select('+password')
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Now user.password should contain the hashed password from the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Remove password from the user object before sending it to the frontend
        user.password = undefined; // Or delete user.password;
        res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    UserRegistration,
    UserLogin
};