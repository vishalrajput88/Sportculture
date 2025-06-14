const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Secret key for JWT
const JWT_SECRET = 'your-secret-key';

// Store for admin users (in a real app, this would be a database)
const adminUsers = [];

// Store for customers (in a real app, this would be a database)
const customers = [];

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

// Admin signup endpoint
app.post('/api/admin/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    if (adminUsers.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = {
      id: adminUsers.length + 1,
      name,
      email,
      password: hashedPassword,
      phone,
    };

    adminUsers.push(newAdmin);

    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user
    const admin = adminUsers.find(user => user.email === email);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Customer signup endpoint
app.post('/api/customers/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    if (customers.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const newCustomer = {
      id: customers.length + 1,
      name,
      email,
      password: hashedPassword,
      phone,
    };

    customers.push(newCustomer);

    res.status(201).json({ message: 'Customer account created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating customer account' });
  }
});

// Customer login endpoint
app.post('/api/customers/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer
    const customer = customers.find(user => user.email === email);
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, customer.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: customer.id, email: customer.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token and user data (excluding password)
    const { password: _, ...userData } = customer;
    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get admin's venues
app.get('/api/admin/venues', authenticateToken, (req, res) => {
  // In a real app, you would filter venues by admin ID
  res.json(turfs);
});

// Add new venue
app.post('/api/admin/venues', authenticateToken, (req, res) => {
  const newVenue = {
    id: turfs.length + 1,
    ...req.body,
    rating: 0,
    images: [
      `https://images.unsplash.com/photo-1595435934249-5df7ed86e1c${turfs.length + 1}?w=800&auto=format&fit=crop&q=60`,
      `https://images.unsplash.com/photo-1595435934249-5df7ed86e1c${turfs.length + 2}?w=800&auto=format&fit=crop&q=60`
    ]
  };
  turfs.push(newVenue);
  res.status(201).json(newVenue);
});

// Update venue
app.put('/api/admin/venues/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = turfs.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Venue not found' });
  }

  turfs[index] = { ...turfs[index], ...req.body };
  res.json(turfs[index]);
});

// Delete venue
app.delete('/api/admin/venues/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = turfs.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Venue not found' });
  }

  turfs.splice(index, 1);
  res.status(204).send();
});

// Dummy turf data
const turfs = [
  {
    id: 1,
    name: "Elite Arena Badminton Court",
    city: "Mumbai",
    sport: "badminton",
    price: 800,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c6?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "10:00" },
      { date: "2024-03-20", time: "12:00" }
    ],
    facilities: ["Parking", "AC Hall", "Equipment Rental"],
    location: { lat: 19.0760, lng: 72.8777 },
    address: "123 Sports Complex, Andheri West, Mumbai - 400053",
    description: "State-of-the-art badminton court with professional flooring and lighting. Perfect for both casual players and serious enthusiasts.",
    contact: {
      phone: "+91 98765 43210",
      email: "elitearena@example.com"
    },
    openingHours: {
      "Monday": "6:00 AM - 10:00 PM",
      "Tuesday": "6:00 AM - 10:00 PM",
      "Wednesday": "6:00 AM - 10:00 PM",
      "Thursday": "6:00 AM - 10:00 PM",
      "Friday": "6:00 AM - 10:00 PM",
      "Saturday": "6:00 AM - 10:00 PM",
      "Sunday": "6:00 AM - 10:00 PM"
    }
  },
  {
    id: 2,
    name: "Table Tennis Elite Center",
    city: "Mumbai",
    sport: "table-tennis",
    price: 750,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c1?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "15:00" },
      { date: "2024-03-20", time: "17:00" }
    ],
    facilities: ["Parking", "Equipment Rental", "Refreshments"],
    location: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 3,
    name: "Table Tennis Masters Arena",
    city: "Delhi",
    sport: "table-tennis",
    price: 800,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "16:00" },
      { date: "2024-03-20", time: "18:00" }
    ],
    facilities: ["Parking", "AC Hall", "Equipment Rental"],
    location: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 4,
    name: "Table Tennis Pro League",
    city: "Bangalore",
    sport: "table-tennis",
    price: 850,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "14:00" },
      { date: "2024-03-20", time: "16:00" }
    ],
    facilities: ["Parking", "Pro Shop", "Refreshments"],
    location: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 5,
    name: "Basketball Court Pro",
    city: "Chennai",
    sport: "basketball",
    price: 900,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "11:00" },
      { date: "2024-03-20", time: "13:00" }
    ],
    facilities: ["Parking", "Floodlights", "Refreshments"],
    location: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 6,
    name: "Royal Volleyball Court",
    city: "Delhi",
    sport: "volleyball",
    price: 1200,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "17:00" },
      { date: "2024-03-20", time: "19:00" }
    ],
    facilities: ["Parking", "Changing Rooms", "Water Dispenser"],
    location: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 7,
    name: "Basketball Excellence Center",
    city: "Bangalore",
    sport: "basketball",
    price: 1500,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "16:00" },
      { date: "2024-03-20", time: "18:00" }
    ],
    facilities: ["Parking", "Water Dispenser", "First Aid"],
    location: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 8,
    name: "Table Tennis Pro Hub",
    city: "Chennai",
    sport: "table-tennis",
    price: 600,
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "15:00" },
      { date: "2024-03-20", time: "17:00" }
    ],
    facilities: ["Parking", "Equipment Rental", "Refreshments"],
    location: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 9,
    name: "Tennis Champions Court",
    city: "Hyderabad",
    sport: "tennis",
    price: 2000,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "08:00" },
      { date: "2024-03-20", time: "10:00" }
    ],
    facilities: ["Parking", "Pro Shop", "Restaurant"],
    location: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: 10,
    name: "Pickleball Paradise",
    city: "Ahmedabad",
    sport: "pickleball",
    price: 800,
    rating: 4.5,
    address: "Chhipa Bakhal, Main Road Shanti Nagar Jain Colony, Indore, Madhya Pradesh - 452001",
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "09:00" },
      { date: "2024-03-20", time: "11:00" }
    ],
    facilities: ["Parking", "Equipment Rental", "Refreshments"],
    location: { lat: 23.0225, lng: 72.5714 }
  },
  {
    id: 11,
    name: "Badminton Masters Arena",
    city: "Mumbai",
    sport: "badminton",
    price: 1000,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "07:00" },
      { date: "2024-03-20", time: "09:00" }
    ],
    facilities: ["Parking", "AC Hall", "Equipment Rental"],
    location: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 12,
    name: "Volleyball Victory Ground",
    city: "Delhi",
    sport: "volleyball",
    price: 1100,
    rating: 4.2,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "17:00" },
      { date: "2024-03-20", time: "19:00" }
    ],
    facilities: ["Parking", "Changing Rooms", "Water Dispenser"],
    location: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 13,
    name: "Basketball Stars Court",
    city: "Bangalore",
    sport: "basketball",
    price: 1400,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "16:00" },
      { date: "2024-03-20", time: "18:00" }
    ],
    facilities: ["Parking", "Water Dispenser", "First Aid"],
    location: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 14,
    name: "Tennis Grand Slam Court",
    city: "Hyderabad",
    sport: "tennis",
    price: 2500,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "08:00" },
      { date: "2024-03-20", time: "10:00" }
    ],
    facilities: ["Parking", "Pro Shop", "Restaurant"],
    location: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: 15,
    name: "Pickleball Champions",
    city: "Pune",
    sport: "pickleball",
    price: 850,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "09:00" },
      { date: "2024-03-20", time: "11:00" }
    ],
    facilities: ["Parking", "Equipment Rental", "Refreshments"],
    location: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: 16,
    name: "Badminton Elite Center",
    city: "Mumbai",
    sport: "badminton",
    price: 950,
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "07:00" },
      { date: "2024-03-20", time: "09:00" }
    ],
    facilities: ["Parking", "AC Hall", "Equipment Rental"],
    location: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 17,
    name: "Volleyball Elite Arena",
    city: "Delhi",
    sport: "volleyball",
    price: 1300,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "17:00" },
      { date: "2024-03-20", time: "19:00" }
    ],
    facilities: ["Parking", "Changing Rooms", "Water Dispenser"],
    location: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 18,
    name: "Basketball Pro Court",
    city: "Bangalore",
    sport: "basketball",
    price: 1600,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "16:00" },
      { date: "2024-03-20", time: "18:00" }
    ],
    facilities: ["Parking", "Water Dispenser", "First Aid"],
    location: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 19,
    name: "Tennis Masters Court",
    city: "Hyderabad",
    sport: "tennis",
    price: 2200,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "08:00" },
      { date: "2024-03-20", time: "10:00" }
    ],
    facilities: ["Parking", "Pro Shop", "Restaurant"],
    location: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: 20,
    name: "Pickleball Pro Arena",
    city: "Pune",
    sport: "pickleball",
    price: 950,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "09:00" },
      { date: "2024-03-20", time: "11:00" }
    ],
    facilities: ["Parking", "Equipment Rental", "Refreshments"],
    location: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: 21,
    name: "Badminton Pro Center",
    city: "Mumbai",
    sport: "badminton",
    price: 1100,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "07:00" },
      { date: "2024-03-20", time: "09:00" }
    ],
    facilities: ["Parking", "AC Hall", "Equipment Rental"],
    location: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 22,
    name: "Volleyball Pro Ground",
    city: "Delhi",
    sport: "volleyball",
    price: 1400,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "17:00" },
      { date: "2024-03-20", time: "19:00" }
    ],
    facilities: ["Parking", "Changing Rooms", "Water Dispenser"],
    location: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 23,
    name: "Table Tennis Elite",
    city: "Chennai",
    sport: "table-tennis",
    price: 700,
    rating: 4.1,
    images: [
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "15:00" },
      { date: "2024-03-20", time: "17:00" }
    ],
    facilities: ["Parking", "Equipment Rental", "Refreshments"],
    location: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 24,
    name: "Table Tennis Champions Hub",
    city: "Kolkata",
    sport: "table-tennis",
    price: 700,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "13:00" },
      { date: "2024-03-20", time: "15:00" }
    ],
    facilities: ["Parking", "AC Hall", "Pro Shop", "Refreshments"],
    location: { lat: 22.5726, lng: 88.3639 }
  },
  {
    id: 25,
    name: "Table Tennis Excellence Center",
    city: "Ahmedabad",
    sport: "table-tennis",
    price: 650,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "14:00" },
      { date: "2024-03-20", time: "16:00" }
    ],
    facilities: ["Parking", "Equipment Rental", "Water Dispenser"],
    location: { lat: 23.0225, lng: 72.5714 }
  },
  {
    id: 26,
    name: "Table Tennis Pro League",
    city: "Pune",
    sport: "table-tennis",
    price: 750,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "15:00" },
      { date: "2024-03-20", time: "17:00" }
    ],
    facilities: ["Parking", "AC Hall", "Pro Shop", "Refreshments"],
    location: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: 27,
    name: "Table Tennis Masters Arena",
    city: "Hyderabad",
    sport: "table-tennis",
    price: 800,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "16:00" },
      { date: "2024-03-20", time: "18:00" }
    ],
    facilities: ["Parking", "AC Hall", "Pro Shop", "Restaurant"],
    location: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: 28,
    name: "Table Tennis Elite Center",
    city: "Chennai",
    sport: "table-tennis",
    price: 700,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60"
    ],
    availableSlots: [
      { date: "2024-03-20", time: "17:00" },
      { date: "2024-03-20", time: "19:00" }
    ],
    facilities: ["Parking", "AC Hall", "Equipment Rental", "Refreshments"],
    location: { lat: 13.0827, lng: 80.2707 }
  }
];

// Update existing venues with proper sport-specific images
turfs.forEach(turf => {
  switch(turf.sport) {
    case 'table-tennis':
      turf.images = [
        `https://images.unsplash.com/photo-1595435934249-5df7ed86e1c${turf.id}?w=800&auto=format&fit=crop&q=60`,
        `https://images.unsplash.com/photo-1595435934249-5df7ed86e1c${turf.id + 1}?w=800&auto=format&fit=crop&q=60`
      ];
      break;
    case 'badminton':
      turf.images = [
        `https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c${turf.id}?w=800&auto=format&fit=crop&q=60`,
        `https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c${turf.id + 1}?w=800&auto=format&fit=crop&q=60`
      ];
      break;
    case 'basketball':
      turf.images = [
        `https://images.unsplash.com/photo-1546519638-68e109acd27${turf.id}?w=800&auto=format&fit=crop&q=60`,
        `https://images.unsplash.com/photo-1546519638-68e109acd27${turf.id + 1}?w=800&auto=format&fit=crop&q=60`
      ];
      break;
    case 'tennis':
      turf.images = [
        `https://images.unsplash.com/photo-1595435934249-5df7ed86e1c${turf.id}?w=800&auto=format&fit=crop&q=60`,
        `https://images.unsplash.com/photo-1595435934249-5df7ed86e1c${turf.id + 1}?w=800&auto=format&fit=crop&q=60`
      ];
      break;
    case 'volleyball':
      turf.images = [
        `https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c${turf.id}?w=800&auto=format&fit=crop&q=60`,
        `https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c${turf.id + 1}?w=800&auto=format&fit=crop&q=60`
      ];
      break;
    case 'pickleball':
      turf.images = [
        `https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c${turf.id}?w=800&auto=format&fit=crop&q=60`,
        `https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c${turf.id + 1}?w=800&auto=format&fit=crop&q=60`
      ];
      break;
  }
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Turf Booking API is running' });
});

// Search turfs endpoint
app.get('/api/turfs/search', (req, res) => {
  const { sport, city } = req.query;
  
  let filteredTurfs = turfs;
  
  if (sport) {
    filteredTurfs = filteredTurfs.filter(turf => 
      turf.sport.toLowerCase() === sport.toLowerCase()
    );
  }

  if (city) {
    filteredTurfs = filteredTurfs.filter(turf => 
      turf.city.toLowerCase() === city.toLowerCase()
    );
  }
  
  res.json(filteredTurfs);
});

// Get turf by ID endpoint
app.get('/api/turfs/:id', (req, res) => {
  const { id } = req.params;
  const turf = turfs.find(t => Number(t.id) === Number(id));

  if (turf) {
    res.json(turf);
  } else {
    res.status(404).json({ message: 'Turf not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 