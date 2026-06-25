import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import AdminAddUser from './pages/AdminAddUser';
import StoreList from './pages/StoreList';
import OwnerRatings from './pages/OwnerRating';
import StoreDetails from './pages/StoreDetails';
import Home from './pages/home';
import ForgotPassword from '../src/pages/ForgotPassword';
import ResetPassword from '../src/pages/ResetPassword';
import VerifyResetOtp from '../src/pages/VerifyResetOtp';
import ChangePassword from './pages/ChangePassword';
import StoreManagement from './components/StoreManagement';
import Navbar from './components/Navbar';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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

  const isAuthRoute = ['/login', '/signup', '/forgot-password', '/verify-reset-otp', '/reset-password', '/change-password'].includes(location.pathname);
  const containerClass = location.pathname === '/' || isAuthRoute 
    ? '' 
    : 'pt-28 pb-12 px-4 max-w-7xl mx-auto';

  return (
    <div className="bg-dark-900 min-h-screen">
      <Navbar user={user} setUser={setUser} />
      
      <div className={containerClass}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/users/new" element={<AdminAddUser />} />
          <Route path="/stores" element={<StoreList />} />
          <Route path="/stores/:id" element={<StoreDetails />} />
          <Route path="/manage-stores" element={<StoreManagement />} />
          <Route path="/owner/ratings" element={<OwnerRatings />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  );
}