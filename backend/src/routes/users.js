const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken, isSuperAdmin } = require('../middleware/auth');

// Get all users (super admin only)
router.get('/', authenticateToken, isSuperAdmin, UserController.getAllUsers);

// Update user role (super admin only)
router.put('/:userId/role', authenticateToken, isSuperAdmin, UserController.updateUserRole);

// Get user profile
router.get('/profile', authenticateToken, UserController.getUserProfile);

// Update user profile
router.put('/profile', authenticateToken, UserController.updateUserProfile);

module.exports = router; 