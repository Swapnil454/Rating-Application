import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
  });

  const [otp, setOtp] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      address: '',
      password: '',
      role: 'user',
    });
    setOtp('');
    setEmailForOtp('');
    setShowOtpField(false);
    setMessage('');
    setSuccess(false);
    setLoading(false);
    setTempUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showOtpField) {
      try {
        setLoading(true);
        const res = await api.post('/api/auth/verify-otp', {
          email: emailForOtp,
          otpInput: otp,
        });

        console.log("Sending OTP Verification:", { email: emailForOtp, otp });


        setMessage(res.data.message || 'Email verified!');
        setSuccess(true);
        alert('Signup successful! Redirecting to login...');

        resetForm();

        setTimeout(() => navigate('/login'), 1000);
      } catch (err) {
        setMessage(err.response?.data?.error || 'OTP verification failed.');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const res = await api.post('/api/auth/signup', form);

        setMessage(res.data.message || 'Signup successful! Please check your email for OTP.');
        setShowOtpField(true);
        setEmailForOtp(form.email);
        setTempUser(res.data.tempUser);
        setSuccess(true);
      } catch (err) {
        setMessage(err.response?.data?.error || 'Something went wrong.');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/resend-otp', { email: emailForOtp });
      setMessage(res.data.message || 'OTP resent successfully.');
      setSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to resend OTP.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-900 dark:from-slate-900 dark:to-slate-800 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 border border-white/20 dark:border-slate-800"
      >
        <h2 className="text-3xl font-bold text-center text-white dark:text-slate-200">
          {showOtpField ? '🔐 Verify OTP' : '📝 Sign Up'}
        </h2>

        {!showOtpField ? (
          <div className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
            >
              <option value="user">👤 User</option>
              <option value="owner">🏪 Store Owner</option>
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleResendOtp}
              className="w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium"
              disabled={loading}
            >
              {loading ? 'Sending...' : '🔁 Resend OTP'}
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading
            ? 'Processing...'
            : showOtpField
            ? '✅ Verify OTP'
            : '📝 Create Account'}
        </button>

        {message && (
          <div
            className={`text-center text-sm font-medium ${
              success ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </div>
        )}
      </motion.form>
    </div>
  );
};

export default SignupForm;

