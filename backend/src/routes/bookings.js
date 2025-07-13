const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Create booking
router.post('/', authenticateToken, BookingController.createBooking);

// Get user bookings
router.get('/', authenticateToken, BookingController.getUserBookings);

// Get all bookings (admin only)
router.get('/all', authenticateToken, isAdmin, BookingController.getAllBookings);

// Get booking by ID
router.get('/:id', authenticateToken, BookingController.getBookingById);

// Update booking status
router.put('/:id/status', authenticateToken, BookingController.updateBookingStatus);

module.exports = router; 