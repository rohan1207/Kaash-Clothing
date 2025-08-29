const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// Function to generate token - using _id consistently
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET || 'saisneh_hospital_secret_key_2025',
    { expiresIn: '30d' }
  );
};

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    console.log('GET /me endpoint hit with user:', { 
      id: req.user._id,
      role: req.user.role,
      headers: req.headers 
    });
    
    if (!req.user?._id) {
      console.log('No user ID in request');
      return res.status(400).json({
        success: false,
        message: 'No user ID in request'
      });
    }

    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user._id).select('-password');
    } else {
      user = await User.findById(req.user._id).select('-password');
    }
    
    if (!user) {
      console.log('User not found with ID:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User found:', { id: user._id, role: user.role });
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @desc    Get all admins
// @route   GET /api/auth/admins
// @access  Private/Admin
router.get('/admins', protect, async (req, res) => {
  try {
    // Ensure the user is an admin before proceeding
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have permission to access this resource.' 
      });
    }

    // Fetch all admins and exclude their passwords
    const admins = await Admin.find({}).select('-password');

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register a new patient
router.post('/patient/register', async (req, res) => {
  try {
    const { name, phone, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this phone number'
      });
    }

    // Create new patient user
    const user = await User.create({
      name,
      phone,
      password,
      address,
      role: 'patient'
    });

    // Generate token using the helper function
    const token = generateToken(user);

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Patient login
router.post('/patient/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ phone }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Generate token using the helper function
    const token = generateToken(user);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { adminId, password } = req.body;
    
    console.log('Admin login attempt with ID:', adminId);

    // Check if admin exists
    const admin = await Admin.findOne({ adminId });
    
    if (!admin) {
      console.log('Admin not found with ID:', adminId);
      return res.status(401).json({
        success: false,
        message: 'Invalid admin ID or password'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for admin:', adminId);
      return res.status(401).json({
        success: false,
        message: 'Invalid admin ID or password'
      });
    }

    console.log('Admin authenticated successfully:', admin._id);

    // Generate token with role
    const token = jwt.sign(
      { _id: admin._id, role: 'admin' },
      process.env.JWT_SECRET || 'saisneh_hospital_secret_key_2025',
      { expiresIn: '30d' }
    );

    // Remove sensitive data and prepare response
    const adminData = {
      _id: admin._id,
      name: admin.name,
      adminId: admin.adminId,
      role: 'admin'
    };

    console.log('Admin login successful:', { id: admin._id, adminId: admin.adminId });
    
    res.status(200).json({
      success: true,
      token,
      data: adminData
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
});

module.exports = router;
