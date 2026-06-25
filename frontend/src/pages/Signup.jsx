import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [otp, setOtp] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'name':
        if (value.length > 0 && (value.trim().length < 20 || value.trim().length > 60)) {
          errorMsg = 'Name must be 20-60 characters.';
        }
        break;
      case 'address':
        if (value.length > 400) {
          errorMsg = 'Max 400 chars allowed.';
        }
        break;
      case 'password':
        if (value.length > 0) {
          if (value.length < 8 || value.length > 16) errorMsg = 'Must be 8-16 chars.';
          else if (!/[A-Z]/.test(value)) errorMsg = 'Needs 1 uppercase letter.';
          else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errorMsg = 'Needs 1 special char.';
        }
        break;
      case 'email':
        if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMsg = 'Invalid email address.';
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'email') {
      value = value.toLowerCase();
    }
    
    setForm({ ...form, [name]: value });
    
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const resetForm = () => {
    setForm({ name: '', email: '', address: '', password: '', role: 'user' });
    setErrors({});
    setOtp('');
    setEmailForOtp('');
    setShowOtpField(false);
    setMessage('');
    setSuccess(false);
    setLoading(false);
  };

  const isAddressValid = form.address.trim() !== '' && form.address.trim().length <= 400;

  const isFormValid = 
    form.name.trim().length >= 20 && form.name.trim().length <= 60 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    isAddressValid &&
    form.password.length >= 8 && form.password.length <= 16 && /[A-Z]/.test(form.password) && /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
    
  const isOtpValid = otp.trim().length > 0;
  const isSubmitDisabled = loading || (showOtpField ? !isOtpValid : !isFormValid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    if (showOtpField) {
      try {
        setLoading(true);
        const res = await api.post('/api/auth/verify-otp', {
          email: emailForOtp,
          otpInput: otp,
        });

        setMessage(res.data.message || 'Email verified! Redirecting to login...');
        setSuccess(true);
        
        setTimeout(() => {
          resetForm();
          navigate('/login');
        }, 1500);
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
        setSuccess(true);
        setResendTimer(120);
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
      setResendTimer(120);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to resend OTP.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
           {showOtpField ? 'Verify Email' : 'Create an Account'}
        </h2>
        <p className="text-gray-400 text-sm">
           {showOtpField ? 'Enter the code sent to your email' : 'Join our growing community today.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
        {!showOtpField ? (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative flex flex-col gap-1">
                <label htmlFor="name" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
                  Full Name
                </label>
                <input
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={`w-full bg-transparent border-0 border-b-2 text-white px-1 pb-2 focus:ring-0 focus:outline-none transition-colors text-sm ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-arcova-gold'}`}
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.span initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-wide">
                      {errors.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex flex-col gap-1">
                <label htmlFor="email" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`w-full bg-transparent border-0 border-b-2 text-white px-1 pb-2 focus:ring-0 focus:outline-none transition-colors text-sm ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-arcova-gold'}`}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.span initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-wide">
                      {errors.email}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative flex flex-col gap-1 overflow-hidden">
              <label htmlFor="address" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1 mt-1">
                Location / Address
              </label>
              <input
                name="address"
                id="address"
                placeholder="City, Country"
                value={form.address}
                onChange={handleChange}
                required
                className={`w-full bg-transparent border-0 border-b-2 text-white px-1 pb-2 focus:ring-0 focus:outline-none transition-colors text-sm ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-arcova-gold'}`}
              />
              <AnimatePresence>
                {errors.address && (
                  <motion.span initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-wide">
                    {errors.address}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex flex-col gap-1">
              <label htmlFor="password" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
                Password
              </label>
              <input
                name="password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className={`w-full bg-transparent border-0 border-b-2 text-white px-1 pb-2 focus:ring-0 focus:outline-none transition-colors text-sm ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-arcova-gold'}`}
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.span initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-wide">
                    {errors.password}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3 pl-1">Account Type</p>
              <div className="relative flex bg-[#151515] rounded-xl p-1 border border-white/5 shadow-inner">
                <motion.div 
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#222] border border-white/10 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-0"
                  initial={false}
                  animate={{ 
                    left: form.role === 'user' ? '4px' : 'calc(50% + 2px)' 
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
                
                <button 
                  type="button" 
                  onClick={() => setForm({...form, role: 'user'})}
                  className={`relative z-10 flex-1 py-3.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors duration-300 ${form.role === 'user' ? 'text-arcova-gold' : 'text-gray-500 hover:text-white'}`}
                >
                  Consumer
                </button>
                <button 
                  type="button" 
                  onClick={() => setForm({...form, role: 'owner'})}
                  className={`relative z-10 flex-1 py-3.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors duration-300 ${form.role === 'owner' ? 'text-arcova-gold' : 'text-gray-500 hover:text-white'}`}
                >
                  Store Owner
                </button>
              </div>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            <div className="relative flex flex-col gap-1">
              <label htmlFor="otp" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">
                One-Time Password
              </label>
              <input
                name="otp"
                id="otp"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full bg-transparent border-0 border-b-2 border-white/20 text-white px-1 pb-2 focus:ring-0 focus:outline-none focus:border-arcova-gold transition-colors text-center tracking-[0.5em] text-xl font-bold"
              />
            </div>
            <button
              type="button"
              onClick={handleResendOtp}
              className={`w-full py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all ${
                resendTimer > 0 || loading 
                ? 'border-white/5 text-gray-600 bg-white/5 cursor-not-allowed' 
                : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              disabled={loading || resendTimer > 0}
            >
              {loading 
                ? 'Sending...' 
                : resendTimer > 0 
                  ? `Resend in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}` 
                  : 'Resend OTP'}
            </button>
          </motion.div>
        )}

        <button
          type="submit"
          className={`w-full py-4 mt-2 rounded-full font-black uppercase tracking-widest transition-all duration-300 flex justify-center items-center text-xs ${
            isSubmitDisabled 
            ? 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5' 
            : 'bg-white hover:bg-gray-200 text-[#0a0a0a] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:-translate-y-0.5'
          }`}
          disabled={isSubmitDisabled}
        >
          {loading
            ? 'Processing...'
            : showOtpField
            ? 'Verify & Login'
            : 'Join RatingApp'}
        </button>

         {!showOtpField && (
           <div className="text-center mt-2 text-xs text-gray-500">
             Already a member? <Link to="/login" className="text-white hover:text-arcova-gold transition-colors font-bold ml-1 border-b border-white/30 hover:border-arcova-gold pb-0.5">Sign in</Link>
           </div>
         )}

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

export default Signup;
