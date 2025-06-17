const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Venue = require('./models/Venue');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Venue.deleteMany({});

    // Create super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'super_admin'
    });

    // Create regular admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin'
    });

    // Create regular user
    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      phone: '5555555555',
      role: 'customer'
    });

    // Create test venues
    const venues = [
      {
        name: "Elite Arena Badminton Court",
        description: "State-of-the-art badminton court with professional flooring and lighting.",
        city: "Mumbai",
        sport: "badminton",
        price: 800,
        rating: 4.5,
        images: [
          "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c5?w=800&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1613918435762-b7b3f7b5c5c6?w=800&auto=format&fit=crop&q=60"
        ],
        facilities: ["Parking", "AC Hall", "Equipment Rental"],
        address: "123 Sports Complex, Andheri West, Mumbai - 400053",
        contact: {
          phone: "+91 98765 43210",
          email: "elitearena@example.com"
        },
        openingHours: {
          Monday: "6:00 AM - 10:00 PM",
          Tuesday: "6:00 AM - 10:00 PM",
          Wednesday: "6:00 AM - 10:00 PM",
          Thursday: "6:00 AM - 10:00 PM",
          Friday: "6:00 AM - 10:00 PM",
          Saturday: "6:00 AM - 10:00 PM",
          Sunday: "6:00 AM - 10:00 PM"
        },
        owner: admin._id
      },
      {
        name: "Table Tennis Pro Center",
        description: "Professional table tennis facility with international standard equipment.",
        city: "Delhi",
        sport: "table-tennis",
        price: 600,
        rating: 4.7,
        images: [
          "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c1?w=800&auto=format&fit=crop&q=60"
        ],
        facilities: ["Parking", "Equipment Rental", "Refreshments"],
        address: "456 Sports Hub, Connaught Place, Delhi - 110001",
        contact: {
          phone: "+91 98765 43211",
          email: "ttpro@example.com"
        },
        openingHours: {
          Monday: "7:00 AM - 11:00 PM",
          Tuesday: "7:00 AM - 11:00 PM",
          Wednesday: "7:00 AM - 11:00 PM",
          Thursday: "7:00 AM - 11:00 PM",
          Friday: "7:00 AM - 11:00 PM",
          Saturday: "7:00 AM - 11:00 PM",
          Sunday: "7:00 AM - 11:00 PM"
        },
        owner: admin._id
      },
      {
        name: "Basketball Elite Court",
        description: "Professional basketball court with NBA standard flooring.",
        city: "Bangalore",
        sport: "basketball",
        price: 1200,
        rating: 4.8,
        images: [
          "https://images.unsplash.com/photo-1546519638-68e109acd27b?w=800&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1546519638-68e109acd27c?w=800&auto=format&fit=crop&q=60"
        ],
        facilities: ["Parking", "Floodlights", "Refreshments"],
        address: "789 Sports Complex, Koramangala, Bangalore - 560034",
        contact: {
          phone: "+91 98765 43212",
          email: "bbelite@example.com"
        },
        openingHours: {
          Monday: "6:00 AM - 10:00 PM",
          Tuesday: "6:00 AM - 10:00 PM",
          Wednesday: "6:00 AM - 10:00 PM",
          Thursday: "6:00 AM - 10:00 PM",
          Friday: "6:00 AM - 10:00 PM",
          Saturday: "6:00 AM - 10:00 PM",
          Sunday: "6:00 AM - 10:00 PM"
        },
        owner: superAdmin._id
      }
    ];

    await Venue.insertMany(venues);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 