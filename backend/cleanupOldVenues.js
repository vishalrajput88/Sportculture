const mongoose = require('mongoose');
const Venue = require('./models/Venue');
const db = require('./config/db');

// Cities to delete
const citiesToDelete = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai'];

async function cleanup() {
  await db();
  const result = await Venue.deleteMany({ city: { $in: citiesToDelete } });
  console.log(`Deleted ${result.deletedCount} venues from Mumbai, Bangalore, Delhi, and Chennai.`);
  mongoose.connection.close();
}

cleanup(); 