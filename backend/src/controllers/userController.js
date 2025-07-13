const User = require('../models/User');

class UserController {
  // Get all users (super admin only)
  static async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }

  // Update user role (super admin only)
  static async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ message: 'Error updating user role' });
    }
  }

  // Get user profile
  static async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  }

  // Update user profile
  static async updateUserProfile(req, res) {
    try {
      const { name, phone } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({ message: 'Error updating user profile' });
    }
  }
}

module.exports = UserController; 