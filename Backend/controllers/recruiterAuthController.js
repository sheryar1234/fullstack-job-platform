const User = require('../models/recruiterUser');
const jwt = require('jsonwebtoken');

// Signup controller
const recruiterSignup = async (req, res) => {
  const { email, password ,  firstName, lastName, cnic} = req.body;
   // Check if any required fields are missing
   if (!firstName || !lastName || !cnic || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Validate password length
    if (password.length > 12) {
      return res.status(400).json({ message: 'Password must be 12 characters or fewer' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ email, password ,firstName, lastName, cnic });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'keyyyyy', { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
const recruiterLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate password length
    if (password.length > 12) {
      return res.status(400).json({ message: 'Password must be 12 characters or fewer' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is allowed to login
    if (!user.isAllowed) {
      return res.status(403).json({ message: 'Your login is currently disabled' });
    }

    // Check if passwords match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'keyyyyy',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { recruiterSignup, recruiterLogin };

