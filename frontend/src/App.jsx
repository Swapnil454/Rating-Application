
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import StoreList from './pages/StoreList';
import OwnerRatings from './pages/OwnerRating';
import Home from './pages/home';
import ForgotPassword from '../src/pages/ForgotPassword';
import ResetPassword from '../src/pages/ResetPassword';
import VerifyResetOtp from '../src/pages/VerifyResetOtp';
import UserManagement from './components/UserManagement';
import StoreManagement from './components/StoreManagement';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white bg-opacity-80 backdrop-blur shadow-md">
  <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
    <div className="flex items-center space-x-6">
      <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-300">
        Rating App
      </Link>
      <Link to="/dashboard" className="hover:text-indigo-700">Dashboard</Link>
      {user?.role === 'admin' && (
        <>
          <Link to="/users" className="hover:text-indigo-700">Users</Link>
          <Link to="/stores" className="hover:text-indigo-700">Stores</Link>
          <Link to="/admin/users" className="hover:text-indigo-700">User Management</Link>
          <Link to="/admin/stores" className="hover:text-indigo-700">Store Management</Link>
        </>
      )}
      {user?.role === 'owner' && (
        <Link to="/owner/ratings" className="hover:text-indigo-700">
          View My Ratings
        </Link>
      )}
    </div>

    <div className="flex items-center space-x-4">
      {!user && (
        <>
          <Link to="/login" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition">
            Login
          </Link>
          <Link to="/signup" className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition">
            Signup
          </Link>
        </>
      )}

      {user && (
        <>
          <span className="text-green-700">{user.name} ({user.role})</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </>
      )}
    </div>
  </div>
</nav>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/stores" element={<StoreManagement />} />
        <Route path="/owner/ratings" element={<OwnerRatings/>} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}