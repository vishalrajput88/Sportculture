const ResponseHandler = require('../utils/responseHandler');

class ValidationMiddleware {
  static validateBooking(req, res, next) {
    const { venueId, date, startTime, endTime } = req.body;
    const errors = [];

    if (!venueId) errors.push('Venue ID is required');
    if (!date) errors.push('Date is required');
    if (!startTime) errors.push('Start time is required');
    if (!endTime) errors.push('End time is required');

    if (errors.length > 0) {
      return ResponseHandler.validationError(res, errors);
    }

    // Validate date format
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return ResponseHandler.validationError(res, ['Invalid date format']);
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return ResponseHandler.validationError(res, ['Invalid time format. Use HH:MM format']);
    }

    // Validate that end time is after start time
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    if (end <= start) {
      return ResponseHandler.validationError(res, ['End time must be after start time']);
    }

    next();
  }

  static validateUserSignup(req, res, next) {
    const { name, email, password, phone } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!email || !email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!phone || phone.length < 10) {
      errors.push('Valid phone number is required');
    }

    if (errors.length > 0) {
      return ResponseHandler.validationError(res, errors);
    }

    next();
  }

  static validateUserLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');

    if (errors.length > 0) {
      return ResponseHandler.validationError(res, errors);
    }

    next();
  }

  static validateVenueSearch(req, res, next) {
    const { sport, city } = req.query;
    
    // Both parameters are optional, so no validation needed
    // But we can add validation if needed in the future
    
    next();
  }
}

module.exports = ValidationMiddleware; 