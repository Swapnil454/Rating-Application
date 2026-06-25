import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, ArrowLeft, Shield, User, Store, Eye, EyeOff } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'user', label: 'Normal User', icon: User, color: 'blue' },
  { value: 'admin', label: 'Administrator', icon: Shield, color: 'red' },
  { value: 'owner', label: 'Store Owner', icon: Store, color: 'amber' },
];

const INITIAL_FORM = { name: '', email: '', address: '', password: '', role: 'user' };

const AdminAddUser = () => {
  const navigate = window.history;
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3500);
  };

  const validate = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required.';
        if (value.trim().length < 20) return 'Name must be at least 20 characters.';
        if (value.trim().length > 60) return 'Name must be at most 60 characters.';
        break;
      case 'email':
        if (!value) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address.';
        break;
      case 'address':
        if (!value) return 'Address is required.';
        if (value.length > 400) return 'Address max 400 characters.';
        break;
      case 'password':
        if (!value) return 'Password is required.';
        if (value.length < 8 || value.length > 16) return 'Must be 8-16 characters.';
        if (!/[A-Z]/.test(value)) return 'Needs at least 1 uppercase letter.';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Needs at least 1 special character.';
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const normalised = name === 'email' ? value.toLowerCase() : value;
    setForm((prev) => ({ ...prev, [name]: normalised }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isValid =
    !Object.values(errors).some(Boolean) &&
    form.name.trim().length >= 20 &&
    form.email &&
    form.address &&
    form.password;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    ['name', 'email', 'address', 'password'].forEach((field) => {
      const err = validate(field, form[field]);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/users', form);
      showToast(`User "${form.name}" created successfully!`, 'success');
      setTimeout(() => navigate.back(), 1500);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create user.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const containerFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.07 } },
  };

  const itemFade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className="pt-16 pb-12 min-h-screen px-6 lg:px-12 text-zinc-100 font-sans"
      initial="hidden"
      animate="show"
      variants={containerFade}
    >
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed top-24 right-6 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 border backdrop-blur-md font-medium text-sm ${
              toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        <motion.div variants={itemFade} className="mb-6">
          <Link
            to="/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700/50"
          >
            <ArrowLeft size={14} /> Back to Users
          </Link>
        </motion.div>

        <motion.div variants={itemFade} className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-zinc-400" /> Add New User
          </h1>
          <p className="text-zinc-400 text-sm">
            Create a new user account. Admin-created accounts are pre-verified.
          </p>
        </motion.div>

        <motion.form
          variants={itemFade}
          onSubmit={handleSubmit}
          noValidate
          className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-3xl p-8 shadow-lg space-y-6"
        >
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Min 20 characters required..."
              className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-all ${
                errors.name
                  ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20'
                  : 'border-zinc-700/50 focus:ring-2 focus:ring-zinc-600'
              }`}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs mt-1.5 font-medium"
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-zinc-600 text-xs mt-1">{form.name.trim().length}/60 characters</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-all ${
                errors.email
                  ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20'
                  : 'border-zinc-700/50 focus:ring-2 focus:ring-zinc-600'
              }`}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs mt-1.5 font-medium"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Address <span className="text-red-400">*</span>
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street, City, Country..."
              rows={3}
              className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-all resize-none ${
                errors.address
                  ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20'
                  : 'border-zinc-700/50 focus:ring-2 focus:ring-zinc-600'
              }`}
            />
            <AnimatePresence>
              {errors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs mt-1.5 font-medium"
                >
                  {errors.address}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="8-16 chars, 1 uppercase, 1 special char"
                className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 pr-11 text-sm text-zinc-200 outline-none transition-all ${
                  errors.password
                    ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20'
                    : 'border-zinc-700/50 focus:ring-2 focus:ring-zinc-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs mt-1.5 font-medium"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Role <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ROLE_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role: value }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-sm font-semibold ${
                    form.role === value
                      ? color === 'blue'
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                        : color === 'red'
                        ? 'bg-red-500/10 border-red-500/40 text-red-300'
                        : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-900/30 border-zinc-700/50 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/users"
              className="flex-1 text-center py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                isValid && !submitting
                  ? 'bg-zinc-200 text-zinc-900 hover:bg-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AdminAddUser;
