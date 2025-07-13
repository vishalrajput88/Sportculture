const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Static venue data
const staticVenues = [
  {
    name: 'Elite Arena Badminton Court',
    description: 'State-of-the-art badminton court with professional flooring and lighting.',
    city: 'Mumbai',
    sport: 'badminton',
    price: 800,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60'
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
    name: 'Grand Slam Tennis Court',
    description: 'Premium tennis court with clay and hard surfaces.',
    city: 'Pune',
    sport: 'tennis',
    price: 1000,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60'
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
    name: 'Basketball Elite Court',
    description: 'Professional basketball court with NBA standard flooring.',
    city: 'Bangalore',
    sport: 'basketball',
    price: 1200,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60'
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
    name: 'Table Tennis Pro Center',
    description: 'Professional table tennis facility with international standard equipment.',
    city: 'Delhi',
    sport: 'table-tennis',
    price: 600,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800&auto=format&fit=crop&q=60'
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
    name: 'Volleyball Beach Arena',
    description: 'Outdoor volleyball court with sand and floodlights.',
    city: 'Goa',
    sport: 'volleyball',
    price: 900,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?w=800&auto=format&fit=crop&q=60'
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
    name: 'Pickleball Smash Court',
    description: 'Modern pickleball court with synthetic flooring and night lighting.',
    city: 'Hyderabad',
    sport: 'pickleball',
    price: 700,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60'
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

// Generate additional venues
const sports = ['badminton', 'tennis', 'basketball', 'table-tennis', 'volleyball', 'pickleball', 'football', 'cricket', 'hockey', 'squash'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata', 'Goa', 'Indore'];
const facilitiesList = ['Parking', 'AC Hall', 'Equipment Rental', 'Refreshments', 'Locker Room', 'Floodlights', 'Showers', 'Night Lighting', 'Cafeteria', 'WiFi'];
const images = [
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1505843275257-8491bfa3b61c?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1505672678657-cc7037095e2c?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60',
];

function getRandom(arr, n = 1) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return n === 1 ? shuffled[0] : shuffled.slice(0, n);
}

// Generate additional venues
for (let i = 0; i < 50; i++) {
  const sport = getRandom(sports);
  const city = getRandom(cities);
  const name = `${city} ${sport.charAt(0).toUpperCase() + sport.slice(1)} Arena #${i + 1}`;
  staticVenues.push({
    name,
    description: `A top-notch ${sport} venue in ${city} with excellent facilities and great atmosphere.`,
    city,
    sport,
    price: Math.floor(Math.random() * 1000) + 400,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    images: getRandom(images, 2),
    facilities: getRandom(facilitiesList, 4),
    address: `${Math.floor(Math.random() * 1000) + 1} ${city} Sports Road, ${city} - ${100000 + i}`,
    contact: {
      phone: `+91 98${Math.floor(Math.random() * 100000000)}`,
      email: `${sport}${i + 1}@example.com`
    },
    openingHours: {
      Monday: '6:00 AM - 10:00 PM',
      Tuesday: '6:00 AM - 10:00 PM',
      Wednesday: '6:00 AM - 10:00 PM',
      Thursday: '6:00 AM - 10:00 PM',
      Friday: '6:00 AM - 10:00 PM',
      Saturday: '6:00 AM - 10:00 PM',
      Sunday: '6:00 AM - 10:00 PM'
    },
    owner: String((i % 3) + 1)
  });
}

// Admin users
const adminUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin'
  },
  {
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'admin123',
    phone: '1234567890',
    role: 'super_admin'
  }
];

class DatabaseSeeder {
  static async seedVenues() {
    try {
      // Clear existing venues
      await Venue.deleteMany({});
      
      // Insert venues
      const venues = await Venue.insertMany(staticVenues);
      console.log(`✅ Seeded ${venues.length} venues`);
      return venues;
    } catch (error) {
      console.error('❌ Error seeding venues:', error);
      throw error;
    }
  }

  static async seedUsers() {
    try {
      // Clear existing users
      await User.deleteMany({});
      
      // Hash passwords and insert users
      const hashedUsers = await Promise.all(
        adminUsers.map(async (user) => ({
          ...user,
          password: await bcrypt.hash(user.password, 12)
        }))
      );
      
      const users = await User.insertMany(hashedUsers);
      console.log(`✅ Seeded ${users.length} users`);
      return users;
    } catch (error) {
      console.error('❌ Error seeding users:', error);
      throw error;
    }
  }

  static async seedAll() {
    try {
      console.log('🌱 Starting database seeding...');
      
      await this.seedUsers();
      await this.seedVenues();
      
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
}

module.exports = DatabaseSeeder; 