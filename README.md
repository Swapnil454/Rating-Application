# Rating App

## Overview

A comprehensive full-stack web application designed for rating and managing local stores. The platform facilitates community-driven reviews, providing distinct tools and interfaces for standard users, store owners, and platform administrators.

**Live Demo**: https://www.ratingapp.online

## Features

- **User Authentication**: Secure sign up, login, and password recovery utilizing One-Time Passwords (OTP).
- **Role-based Access Control**: Distinct capabilities and dashboards for Users, Store Owners, and Admins.
- **Store Rating System**: Enables users to evaluate stores, assign ratings, and submit detailed feedback.
- **Store Management**: Allows store owners to monitor their average ratings, view recent reviews, and update store details.
- **Admin Panel**: Centralized dashboard for managing all platform users, stores, and moderation.
- **Responsive Design**: Highly optimized, mobile-friendly interface built with Tailwind CSS and Framer Motion.

## Technology Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion (Animations)
- React Router (Routing)
- Axios (HTTP Client)
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- PostgreSQL with Sequelize ORM
- JWT (JSON Web Tokens) Authentication
- Bcrypt (Password Hashing)
- Resend (Email Delivery for OTPs)
- Express Rate Limiting

## Project Structure

```text
Rating-App/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── app.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL Database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Swapnil454/rating-app.git
cd rating-app
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Configuration**

Create a `.env` file in the `backend` directory with the following variables:
```env
POSTGRES_URI=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8786
RESEND_API_KEY=your_resend_api_key
```

Create a `.env` file in the `frontend` directory with the following variables:
```env
VITE_API_URL=http://localhost:8786
```

4. **Run the application**

```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store (Admin only)
- `PUT /api/stores/:id` - Update store (Admin/Owner)
- `DELETE /api/stores/:id` - Delete store (Admin only)

### Ratings
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Create rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

## User Roles

1. **User**: Can browse stores, submit ratings, and manage their own review history.
2. **Owner**: Can view rating analytics for their specific stores and manage store contact/location information.
3. **Admin**: Has full access to user management, store management, and system-wide administration.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions regarding the setup, please open an issue on the repository.