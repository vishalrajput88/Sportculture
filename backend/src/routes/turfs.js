const express = require('express');
const router = express.Router();
const StaticDataService = require('../services/staticData');

// Search turfs
router.get('/search', (req, res) => {
  try {
    const { sport, city } = req.query;
    const results = StaticDataService.searchVenues(sport, city);
    res.json(results);
  } catch (error) {
    console.error('Search turfs error:', error);
    res.status(500).json({ message: 'Error searching turfs' });
  }
});

// Get turf by ID
router.get('/:id', (req, res) => {
  try {
    const venue = StaticDataService.getVenueById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Turf not found (static)' });
    }
    res.json(venue);
  } catch (error) {
    console.error('Get turf by ID error:', error);
    res.status(500).json({ message: 'Error fetching turf' });
  }
});

module.exports = router; 