import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const val = e.target.value.toLowerCase();
    setEmail(val);
    
    if (val.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Invalid email address.');
    } else {
      setEmailError('');
    }
  };

  const isSubmitDisabled = loading || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'OTP sent to your email.');
      localStorage.setItem('resetEmail', email);
      setTimeout(() => navigate('/verify-reset-otp'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Forgot Password
        </h2>
        <p className="text-gray-400 text-sm">Submit your registered email for an OTP.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
        
        <div className="relative flex flex-col gap-1">
          <label htmlFor="email" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
            Email Address
          </label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={handleChange}
            required
            className={`w-full bg-transparent border-0 border-b-2 text-white px-1 pb-2 focus:ring-0 focus:outline-none transition-colors text-sm ${emailError ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-arcova-gold'}`}
          />
          <AnimatePresence>
            {emailError && (
              <motion.span initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-wide">
                {emailError}
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
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <div className="text-center mt-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
          <Link to="/login" className="text-white hover:text-arcova-gold transition-colors ml-1 border-b border-white/30 hover:border-arcova-gold pb-0.5">BACK TO LOGIN</Link>
        </div>

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

export default ForgotPassword;
