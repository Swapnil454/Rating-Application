import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'password') {
      if (value.length > 0) {
        if (value.length < 8 || value.length > 16) errorMsg = 'Must be 8-16 chars.';
        else if (!/[A-Z]/.test(value)) errorMsg = 'Needs 1 uppercase letter.';
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errorMsg = 'Needs 1 special char.';
      }
    } else if (name === 'confirmPassword') {
      if (value.length > 0 && value !== form.password) {
        errorMsg = 'Passwords do not match.';
      }
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    
    if (name === 'password' && form.confirmPassword) {
      setErrors(prev => ({ 
        ...prev, 
        confirmPassword: value !== form.confirmPassword ? 'Passwords do not match.' : '' 
      }));
    }
  };

  const isFormValid = 
    form.password.length >= 8 && 
    form.password.length <= 16 && 
    /[A-Z]/.test(form.password) && 
    /[!@#$%^&*(),.?":{}|<>]/.test(form.password) &&
    form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    try {
      setLoading(true);
      const res = await api.put('/api/auth/update-password', { password: form.password });
      setMessage(res.data.message || 'Password updated successfully!');
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update password.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner">
          <Lock className="w-8 h-8 text-arcova-gold" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Update Password
        </h2>
        <p className="text-gray-400 text-sm">
          Please enter your new strong password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <div className="relative flex flex-col gap-1">
          <label htmlFor="password" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
            New Password
          </label>
          <div className="relative">
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full bg-transparent border-0 border-b-2 text-white px-1 pb-2 pr-10 focus:ring-0 focus:outline-none transition-colors text-sm ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-arcova-gold'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-0 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.span initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-wide">
                {errors.password}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1 mt-2">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full bg-transparent border-0 border-b-2 text-white px-1 pb-2 focus:ring-0 focus:outline-none transition-colors text-sm ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-arcova-gold'}`}
          />
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.span initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-wide">
                {errors.confirmPassword}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          className={`w-full py-4 mt-6 rounded-full font-black uppercase tracking-widest transition-all duration-300 flex justify-center items-center text-xs ${
            !isFormValid || loading
            ? 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5' 
            : 'bg-white hover:bg-gray-200 text-[#0a0a0a] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:-translate-y-0.5'
          }`}
          disabled={!isFormValid || loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-center text-xs font-medium p-3 rounded-lg border ${
                success ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </AuthLayout>
  );
};

export default ChangePassword;
