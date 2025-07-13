const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthController {
  // User signup
  static async signup(req, res) {
    try {
      const { name, email, password, phone, role } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new user
      const user = new User({ 
        name, 
        email, 
        password, 
        phone, 
        role: role || 'customer' 
      });
      
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  // User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Hardcoded admin users for static response
      if (
        (email === 'admin@example.com' && password === 'admin123') ||
        (email === 'superadmin@example.com' && password === 'admin123')
      ) {
        const user = {
          _id: '1',
          name: email === 'admin@example.com' ? 'Admin User' : 'Super Admin',
          email,
          role: email === 'admin@example.com' ? 'admin' : 'super_admin',
          phone: email === 'admin@example.com' ? '9876543210' : '1234567890',
        };
        
        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET || 'staticsecret',
          { expiresIn: '24h' }
        );
        
        res.json({ token, user });
        return;
      }

      // Regular user authentication (commented out for static response)
      // const user = await User.findOne({ email });
      // if (!user) {
      //   return res.status(401).json({ message: 'Invalid credentials' });
      // }
      
      // const isMatch = await user.comparePassword(password);
      // if (!isMatch) {
      //   return res.status(401).json({ message: 'Invalid credentials' });
      // }
      
      // const token = jwt.sign(
      //   { id: user._id, email: user.email, role: user.role }, 
      //   process.env.JWT_SECRET, 
      //   { expiresIn: '24h' }
      // );
      
      // const { password: _, ...userData } = user.toObject();
      // res.json({ token, user: userData });

      res.status(401).json({ message: 'Invalid credentials (static)' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  }
}

module.exports = AuthController; 