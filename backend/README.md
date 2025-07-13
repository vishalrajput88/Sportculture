# Turf Booking Backend API

A professional Node.js/Express backend API for sports venue booking system.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── bookingController.js  # Booking management
│   │   ├── userController.js     # User management
│   │   └── venueController.js    # Venue management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── validation.js        # Request validation middleware
│   ├── models/
│   │   ├── Booking.js           # Booking model
│   │   ├── User.js              # User model
│   │   └── Venue.js             # Venue model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── bookings.js          # Booking routes
│   │   ├── turfs.js             # Turf search routes
│   │   ├── users.js             # User routes
│   │   └── venues.js            # Venue routes
│   ├── services/
│   │   └── staticData.js        # Static data service
│   ├── utils/
│   │   └── responseHandler.js   # Response utility functions
│   └── server.js                # Main server file
├── package.json
├── package-lock.json
├── .env                         # Environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/turf-booking
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (Super Admin only)
- `PUT /api/users/:userId/role` - Update user role (Super Admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get venue by ID
- `POST /api/venues` - Create venue
- `PUT /api/venues/:id` - Update venue
- `DELETE /api/venues/:id` - Delete venue

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (Admin only)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status

### Turfs (Search)
- `GET /api/turfs/search?sport=badminton&city=mumbai` - Search turfs
- `GET /api/turfs/:id` - Get turf by ID

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- `customer` - Regular user
- `admin` - Venue administrator
- `super_admin` - System administrator

## 📝 Features

- **Modular Architecture**: Clean separation of concerns with controllers, services, and routes
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Request Validation**: Input validation middleware for all endpoints
- **Error Handling**: Consistent error responses across the API
- **Static Data**: Pre-populated venue data for demonstration
- **MongoDB Integration**: Mongoose ODM for database operations
- **CORS Support**: Cross-origin resource sharing enabled

## 🛠️ Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Code Style
- Follow ES6+ standards
- Use async/await for asynchronous operations
- Implement proper error handling
- Add JSDoc comments for complex functions

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

### Development
- `nodemon` - Auto-restart server during development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team. 