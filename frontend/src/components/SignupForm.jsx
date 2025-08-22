import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SignupForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', form);
      setMessage(res.data.message || 'Signup successful!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className=" w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-900 dark:from-slate-900 dark:to-slate-800 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 border border-white/20 dark:border-slate-800"
      >
        <h2 className="text-3xl font-bold text-center text-white dark:text-slate-200">
          📝 Sign Up
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
          >
            <option
    value="user"
    className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
  >
    👤 User
  </option>
  <option
    value="owner"
    className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
  >
    🏪 Store Owner
  </option>
  <option
    value="admin"
    className="bg-white  dark:bg-slate-800 text-gray-800 dark:text-white"
  >
    🛡️ Admin
  </option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Create Account
        </button>

        {message && (
          <div className="text-center text-sm text-red-500 font-medium">
            {message}
          </div>
        )}
      </motion.form>
    </div>
  );
};

export default SignupForm;
