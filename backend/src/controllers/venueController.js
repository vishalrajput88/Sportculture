const StaticDataService = require('../services/staticData');

class VenueController {
  // Get all venues
  static async getAllVenues(req, res) {
    try {
      const venues = StaticDataService.getAllVenues();
      res.json(venues);
    } catch (error) {
      console.error('Get venues error:', error);
      res.status(500).json({ message: 'Error fetching venues' });
    }
  }

  // Get venue by ID
  static async getVenueById(req, res) {
    try {
      const venue = StaticDataService.getVenueById(req.params.id);
      if (!venue) {
        return res.status(404).json({ message: 'Venue not found (static)' });
      }
      res.json(venue);
    } catch (error) {
      console.error('Get venue by ID error:', error);
      res.status(500).json({ message: 'Error fetching venue' });
    }
  }

  // Create venue (static response)
  static async createVenue(req, res) {
    try {
      // Static response for now
      res.status(201).json({ message: 'Venue created successfully (static)' });
    } catch (error) {
      console.error('Create venue error:', error);
      res.status(500).json({ message: 'Error creating venue' });
    }
  }

  // Update venue (static response)
  static async updateVenue(req, res) {
    try {
      // Static response for now
      res.json({ message: 'Venue updated successfully (static)' });
    } catch (error) {
      console.error('Update venue error:', error);
      res.status(500).json({ message: 'Error updating venue' });
    }
  }

  // Delete venue (static response)
  static async deleteVenue(req, res) {
    try {
      // Static response for now
      res.json({ message: 'Venue deleted successfully (static)' });
    } catch (error) {
      console.error('Delete venue error:', error);
      res.status(500).json({ message: 'Error deleting venue' });
    }
  }
}

module.exports = VenueController; 