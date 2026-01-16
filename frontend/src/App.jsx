
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

  const [open, setOpen] = useState(false);

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

  const menuLink =
  "py-2 px-2 rounded hover:bg-indigo-50";

  return (
    <>

    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          Rating App
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-indigo-700">Dashboard</Link>

          {user?.role === "admin" && (
            <>
              <Link to="/users" className="hover:text-indigo-700">Users</Link>
              <Link to="/stores" className="hover:text-indigo-700">Stores</Link>
              <Link to="/admin/users" className="hover:text-indigo-700">User Management</Link>
              <Link to="/admin/stores" className="hover:text-indigo-700">Store Management</Link>
            </>
          )}

          {user?.role === "owner" && (
            <Link to="/owner/ratings" className="hover:text-indigo-700">
              View My Ratings
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                Login
              </Link>
              <Link to="/signup" className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="text-green-700">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
{open && (
  <div className="md:hidden bg-white/90 backdrop-blur border-t shadow-lg">
    <div className="flex flex-col px-4 py-4 space-y-2 text-sm">

      {/* Common */}
      <Link
        to="/dashboard"
        onClick={() => setOpen(false)}
        className="py-2 px-2 rounded hover:bg-indigo-50"
      >
        Dashboard
      </Link>

      {/* Admin Links */}
      {user?.role === "admin" && (
        <>
          <Link to="/users" onClick={() => setOpen(false)} className={menuLink}>
            Users
          </Link>
          <Link to="/stores" onClick={() => setOpen(false)} className={menuLink}>
            Stores
          </Link>
          <Link to="/admin/users" onClick={() => setOpen(false)} className={menuLink}>
            User Management
          </Link>
          <Link to="/admin/stores" onClick={() => setOpen(false)} className={menuLink}>
            Store Management
          </Link>
        </>
      )}

      {/* Owner */}
      {user?.role === "owner" && (
        <Link
          to="/owner/ratings"
          onClick={() => setOpen(false)}
          className={menuLink}
        >
          View My Ratings
        </Link>
      )}

      <hr className="my-2" />

      {/* Auth Section */}
      {!user ? (
        <>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="py-2 px-2 rounded hover:bg-indigo-50"
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="py-2 px-2 rounded hover:bg-indigo-50"
          >
            Signup
          </Link>
        </>
      ) : (
        <>
          <span className="px-2 py-2 text-green-700 font-medium">
            {user.name} ({user.role})
          </span>

          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="text-left px-2 py-2 rounded text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </>
      )}
    </div>
  </div>
)}

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