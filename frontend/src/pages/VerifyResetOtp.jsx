import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(120); 
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/verify-reset-otp', { email, otpInput: otp.trim() });
      setMessage(res.data.message);
      setTimeout(() => navigate('/reset-password'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'OTP resent successfully.');
      setResendTimer(120);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
          Verify OTP
        </h2>
        <p className="text-gray-400 text-xs">
          Enter the 6-digit code sent to <span className="font-semibold text-white">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="000000"
            value={otp}
            required
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 text-center tracking-[0.5em] text-xl font-bold rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:ring-2 focus:ring-arcova-gold focus:border-transparent outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 rounded-lg bg-arcova-gold hover:bg-yellow-500 text-[#0a0a0a] font-bold tracking-wide transition-all duration-300 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] flex justify-center items-center text-sm"
        >
          {loading ? 'Processing...' : 'Verify OTP'}
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          className={`w-full py-3 mt-2 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all ${
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

        {message && (
          <div className="text-center text-xs text-green-400 font-medium mt-3 p-2.5 bg-green-400/10 rounded-lg border border-green-400/20">
            {message}
          </div>
        )}
        {error && (
          <div className="text-center text-xs text-red-400 font-medium mt-3 p-2.5 bg-red-400/10 rounded-lg border border-red-400/20">
            {error}
          </div>
        )}
      </form>
    </AuthLayout>
  );
};

export default VerifyResetOtp;
