const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const User = require('../models/User');

class BookingController {
  // Create booking
  static async createBooking(req, res) {
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

      // Calculate total price
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
      console.error('Create booking error:', error);
      res.status(500).json({ message: 'Error creating booking' });
    }
  }

  // Get user bookings
  static async getUserBookings(req, res) {
    try {
      const bookings = await Booking.find({ user: req.user.id })
        .populate('venue', 'name city sport price')
        .sort({ date: -1, startTime: -1 });
      res.json(bookings);
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  }

  // Get booking by ID
  static async getBookingById(req, res) {
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
      console.error('Get booking by ID error:', error);
      res.status(500).json({ message: 'Error fetching booking' });
    }
  }

  // Update booking status
  static async updateBookingStatus(req, res) {
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
      console.error('Update booking status error:', error);
      res.status(500).json({ message: 'Error updating booking status' });
    }
  }

  // Get all bookings (admin only)
  static async getAllBookings(req, res) {
    try {
      const bookings = await Booking.find()
        .populate('venue', 'name city sport price')
        .populate('user', 'name email phone')
        .sort({ date: -1, startTime: -1 });
      res.json(bookings);
    } catch (error) {
      console.error('Get all bookings error:', error);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  }
}

module.exports = BookingController; 