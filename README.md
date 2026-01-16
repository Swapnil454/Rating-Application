# Rating App

A full-stack web application for rating and managing stores, built with React frontend and Node.js backend.

🚀 **Live Demo**: [https://rating-application.vercel.app/](https://rating-application.vercel.app/)

## Features

- **User Authentication**: Sign up, login, password recovery with OTP
- **Role-based Access**: Different functionalities for users, store owners, and admins
- **Store Rating System**: Users can rate stores and provide feedback
- **Store Management**: Store owners can view their ratings and manage store information
- **Admin Panel**: Administrators can manage users and stores
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion (animations)
- React Router
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Express Rate Limiting
- CORS enabled

## Project Structure

```
Rating-App/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── app.js
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/rating-app.git
cd rating-app
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup

Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Run the application

```bash
# From the root directory, run both frontend and backend concurrently
npm run dev

# Or run them separately:
# Backend (from backend directory)
npm start

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

1. **User**: Can rate stores and manage their own ratings
2. **Owner**: Can view ratings for their stores and manage store information
3. **Admin**: Full access to user management, store management, and system administration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.