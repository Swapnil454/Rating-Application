import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const validatePassword = (val) => {
    if (val.length === 0) return '';
    if (val.length < 8 || val.length > 16) return 'Must be 8-16 chars.';
    if (!/[A-Z]/.test(val)) return 'Needs 1 uppercase letter.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) return 'Needs 1 special char.';
    return '';
  };

  const handleNewPassChange = (e) => {
    const val = e.target.value;
    setNewPassword(val);
    setErrors(prev => ({ ...prev, newPassword: validatePassword(val) }));
    if (confirmPassword && val !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPassChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (val !== newPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const isFormValid = 
    newPassword.length >= 8 && newPassword.length <= 16 && 
    /[A-Z]/.test(newPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
    newPassword === confirmPassword;

  const isSubmitDisabled = loading || !isFormValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await api.post('/api/auth/reset-password', {
        email,
        newPassword
      });
      setMessage(res.data.message || 'Password reset successful!');
      localStorage.removeItem('resetEmail');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Set New Password
        </h2>
        <p className="text-gray-400 text-sm">Please create a strong new password.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
        
        <div className="relative flex flex-col gap-1">
          <label htmlFor="newPassword" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
            New Password
          </label>
          <input
            name="newPassword"
            id="newPassword"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={handleNewPassChange}
            required
            className={`w-full bg-transparent border-0 border-b-2 text-white px-1 pb-2 focus:ring-0 focus:outline-none transition-colors text-sm ${errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-arcova-gold'}`}
          />
          <AnimatePresence>
            {errors.newPassword && (
              <motion.span initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-wide">
                {errors.newPassword}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={handleConfirmPassChange}
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
          disabled={isSubmitDisabled}
          className={`w-full py-4 mt-4 rounded-full font-black uppercase tracking-widest transition-all duration-300 flex justify-center items-center text-xs ${
            isSubmitDisabled 
            ? 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5' 
            : 'bg-white hover:bg-gray-200 text-[#0a0a0a] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:-translate-y-0.5'
          }`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-green-400 font-medium p-3 bg-green-400/10 rounded-lg border border-green-400/20"
            >
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-red-400 font-medium p-3 bg-red-400/10 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
