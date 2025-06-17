const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Venue = require('./models/Venue');
const Booking = require('./models/Booking');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is super admin
const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Super admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User signup endpoint
app.post('/api/users/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if email already exists
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
});

// User login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt with:', { email, password });

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token and user data (excluding password)
    const { password: _, ...userData } = user.toObject();
    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get all users (super admin only)
app.get('/api/users', authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user role (super admin only)
app.put('/api/users/:userId/role', authenticateToken, isSuperAdmin, async (req, res) => {
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
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Venue endpoints
app.post('/api/venues', authenticateToken, async (req, res) => {
  try {
    const venue = new Venue({
      ...req.body,
      owner: req.user.id
    });
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Error creating venue' });
  }
});

app.get('/api/venues', async (req, res) => {
  try {
    const venues = await Venue.find().populate('owner', 'name email');
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venues' });
  }
});

app.get('/api/venues/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'name email');
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venue' });
  }
});

app.put('/api/venues/:id', authenticateToken, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Check if user is the owner or super admin
    const user = await User.findById(req.user.id);
    if (venue.owner.toString() !== req.user.id && user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner', 'name email');

    res.json(updatedVenue);
  } catch (error) {
    res.status(500).json({ message: 'Error updating venue' });
  }
});

app.delete('/api/venues/:id', authenticateToken, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Check if user is the owner or super admin
    const user = await User.findById(req.user.id);
    if (venue.owner.toString() !== req.user.id && user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await venue.remove();
    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting venue' });
  }
});

// Booking endpoints
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { venueId, date, startTime, endTime } = req.body;

    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
    return res.status(404).json({ message: 'Venue not found' });
  }

    // Check if the time slot is available
    const existingBooking = await Booking.findOne({
      venue: venueId,
      date,
      startTime,
      endTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Calculate total price (you can implement your own pricing logic)
    const totalPrice = venue.price;

    // Create booking
    const booking = new Booking({
      venue: venueId,
      user: req.user.id,
      date,
      startTime,
      endTime,
      totalPrice
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking' });
  }
});

app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('venue', 'name city sport price')
      .sort({ date: -1, startTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

app.get('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('venue', 'name city sport price')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.user.id) {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

app.put('/api/bookings/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    const user = await User.findById(req.user.id);
    if (booking.user.toString() !== req.user.id && user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

// Serve static files from the public directory (moved to the end)
app.use(express.static(path.join(__dirname, '../public')));

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Turf Booking API is running' });
});

// Search turfs endpoint
app.get('/api/turfs/search', async (req, res) => {
  try {
  const { sport, city } = req.query;
    let query = {};
  
  if (sport) {
      query.sport = new RegExp(sport, 'i'); // Case-insensitive search
  }
  if (city) {
      query.city = new RegExp(city, 'i'); // Case-insensitive search
    }

    const venues = await Venue.find(query).populate('owner', 'name email');
    res.json(venues);
  } catch (error) {
    console.error('Error searching turfs:', error);
    res.status(500).json({ message: 'Error searching turfs' });
  }
});

// Get turf by ID endpoint
app.get('/api/turfs/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'name email');
    if (!venue) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json(venue);
  } catch (error) {
    console.error('Error fetching turf by ID:', error);
    res.status(500).json({ message: 'Error fetching turf' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 