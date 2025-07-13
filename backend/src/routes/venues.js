const express = require('express');
const router = express.Router();
const VenueController = require('../controllers/venueController');

// Get all venues
router.get('/', VenueController.getAllVenues);

// Get venue by ID
router.get('/:id', VenueController.getVenueById);

// Create venue
router.post('/', VenueController.createVenue);

// Update venue
router.put('/:id', VenueController.updateVenue);

// Delete venue
router.delete('/:id', VenueController.deleteVenue);

module.exports = router; 