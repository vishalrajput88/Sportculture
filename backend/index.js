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
  // --- STATIC RESPONSE ---
  // const { name, email, password, phone, role } = req.body;
  // const existingUser = await User.findOne({ email });
  // if (existingUser) {
  //   return res.status(400).json({ message: 'Email already registered' });
  // }
  // const user = new User({ name, email, password, phone, role: role || 'customer' });
  // await user.save();
  // res.status(201).json({ message: 'User created successfully' });
  res.status(201).json({ message: 'User created successfully (static)' });
});

// User login endpoint
app.post('/api/users/login', async (req, res) => {
  // --- STATIC RESPONSE ---
  // const { email, password } = req.body;
  // console.log('Login attempt with:', { email, password });
  // const user = await User.findOne({ email });
  // if (!user) {
  //   return res.status(401).json({ message: 'Invalid credentials' });
  // }
  // const isMatch = await user.comparePassword(password);
  // if (!isMatch) {
  //   return res.status(401).json({ message: 'Invalid credentials' });
  // }
  // const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  // const { password: _, ...userData } = user.toObject();
  // res.json({ token, user: userData });

    const { email, password } = req.body;
  // Hardcoded admin user
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
  } else {
    res.status(401).json({ message: 'Invalid credentials (static)' });
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

// --- STATIC VENUE DATA ---
const staticVenues = [
  {
    id: '1',
    name: 'Elite Arena Badminton Court',
    description: 'State-of-the-art badminton court with professional flooring and lighting.',
    city: 'Mumbai',
    sport: 'badminton',
    price: 800,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60' // Badminton
    ],
    facilities: ['Parking', 'AC Hall', 'Equipment Rental'],
    address: '123 Sports Complex, Andheri West, Mumbai - 400053',
    contact: { phone: '+91 98765 43210', email: 'elitearena@example.com' },
    openingHours: {
      Monday: '6:00 AM - 10:00 PM',
      Tuesday: '6:00 AM - 10:00 PM',
      Wednesday: '6:00 AM - 10:00 PM',
      Thursday: '6:00 AM - 10:00 PM',
      Friday: '6:00 AM - 10:00 PM',
      Saturday: '6:00 AM - 10:00 PM',
      Sunday: '6:00 AM - 10:00 PM'
    },
    owner: '1'
  },
  {
    id: '2',
    name: 'Grand Slam Tennis Court',
    description: 'Premium tennis court with clay and hard surfaces.',
    city: 'Pune',
    sport: 'tennis',
    price: 1000,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60' // Tennis
    ],
    facilities: ['Parking', 'Refreshments', 'Locker Room'],
    address: '456 Tennis Avenue, Koregaon Park, Pune - 411001',
    contact: { phone: '+91 98765 43211', email: 'grandslam@example.com' },
    openingHours: {
      Monday: '7:00 AM - 9:00 PM',
      Tuesday: '7:00 AM - 9:00 PM',
      Wednesday: '7:00 AM - 9:00 PM',
      Thursday: '7:00 AM - 9:00 PM',
      Friday: '7:00 AM - 9:00 PM',
      Saturday: '7:00 AM - 9:00 PM',
      Sunday: '7:00 AM - 9:00 PM'
    },
    owner: '1'
  },
  {
    id: '3',
    name: 'Basketball Elite Court',
    description: 'Professional basketball court with NBA standard flooring.',
    city: 'Bangalore',
    sport: 'basketball',
    price: 1200,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60' // Basketball
    ],
    facilities: ['Parking', 'Floodlights', 'Refreshments'],
    address: '789 Sports Complex, Koramangala, Bangalore - 560034',
    contact: { phone: '+91 98765 43212', email: 'bbelite@example.com' },
    openingHours: {
      Monday: '6:00 AM - 10:00 PM',
      Tuesday: '6:00 AM - 10:00 PM',
      Wednesday: '6:00 AM - 10:00 PM',
      Thursday: '6:00 AM - 10:00 PM',
      Friday: '6:00 AM - 10:00 PM',
      Saturday: '6:00 AM - 10:00 PM',
      Sunday: '6:00 AM - 10:00 PM'
    },
    owner: '2'
  },
  {
    id: '4',
    name: 'Table Tennis Pro Center',
    description: 'Professional table tennis facility with international standard equipment.',
    city: 'Delhi',
    sport: 'table-tennis',
    price: 600,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800&auto=format&fit=crop&q=60' // Table Tennis
    ],
    facilities: ['Parking', 'Equipment Rental', 'Refreshments'],
    address: '456 Sports Hub, Connaught Place, Delhi - 110001',
    contact: { phone: '+91 98765 43213', email: 'ttpro@example.com' },
    openingHours: {
      Monday: '7:00 AM - 11:00 PM',
      Tuesday: '7:00 AM - 11:00 PM',
      Wednesday: '7:00 AM - 11:00 PM',
      Thursday: '7:00 AM - 11:00 PM',
      Friday: '7:00 AM - 11:00 PM',
      Saturday: '7:00 AM - 11:00 PM',
      Sunday: '7:00 AM - 11:00 PM'
    },
    owner: '2'
  },
  {
    id: '5',
    name: 'Volleyball Beach Arena',
    description: 'Outdoor volleyball court with sand and floodlights.',
    city: 'Goa',
    sport: 'volleyball',
    price: 900,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?w=800&auto=format&fit=crop&q=60' // Volleyball
    ],
    facilities: ['Parking', 'Floodlights', 'Showers'],
    address: 'Beachside Sports Complex, Baga Beach, Goa - 403516',
    contact: { phone: '+91 98765 43214', email: 'volleybeach@example.com' },
    openingHours: {
      Monday: '8:00 AM - 8:00 PM',
      Tuesday: '8:00 AM - 8:00 PM',
      Wednesday: '8:00 AM - 8:00 PM',
      Thursday: '8:00 AM - 8:00 PM',
      Friday: '8:00 AM - 8:00 PM',
      Saturday: '8:00 AM - 8:00 PM',
      Sunday: '8:00 AM - 8:00 PM'
    },
    owner: '1'
  },
  {
    id: '6',
    name: 'Pickleball Smash Court',
    description: 'Modern pickleball court with synthetic flooring and night lighting.',
    city: 'Hyderabad',
    sport: 'pickleball',
    price: 700,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60' // Pickleball
    ],
    facilities: ['Parking', 'Night Lighting', 'Equipment Rental'],
    address: 'Pickleball Arena, Jubilee Hills, Hyderabad - 500033',
    contact: { phone: '+91 98765 43215', email: 'pickleballarena@example.com' },
    openingHours: {
      Monday: '7:00 AM - 10:00 PM',
      Tuesday: '7:00 AM - 10:00 PM',
      Wednesday: '7:00 AM - 10:00 PM',
      Thursday: '7:00 AM - 10:00 PM',
      Friday: '7:00 AM - 10:00 PM',
      Saturday: '7:00 AM - 10:00 PM',
      Sunday: '7:00 AM - 10:00 PM'
    },
    owner: '2'
  }
];

// --- STATIC VENUE ENDPOINTS ---

// Get all venues
app.get('/api/venues', (req, res) => {
  res.json(staticVenues);
});

// Get venue by ID
app.get('/api/venues/:id', (req, res) => {
  const venue = staticVenues.find(v => v.id === req.params.id);
  if (!venue) {
    return res.status(404).json({ message: 'Venue not found (static)' });
  }
  res.json(venue);
});

// Create venue
app.post('/api/venues', (req, res) => {
  res.status(201).json({ message: 'Venue created successfully (static)' });
});

// Update venue
app.put('/api/venues/:id', (req, res) => {
  res.json({ message: 'Venue updated successfully (static)' });
});

// Delete venue
app.delete('/api/venues/:id', (req, res) => {
  res.json({ message: 'Venue deleted successfully (static)' });
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
app.get('/api/turfs/search', (req, res) => {
  const { sport, city } = req.query;
  let results = staticVenues;
  if (sport) {
    results = results.filter(v => v.sport.toLowerCase().includes(String(sport).toLowerCase()));
  }
  if (city) {
    results = results.filter(v => v.city.toLowerCase().includes(String(city).toLowerCase()));
  }
  res.json(results);
});

// Get turf by ID endpoint
app.get('/api/turfs/:id', (req, res) => {
  const venue = staticVenues.find(v => v.id === req.params.id);
  if (!venue) {
    return res.status(404).json({ message: 'Turf not found (static)' });
  }
  res.json(venue);
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