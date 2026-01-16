// // pages/VerifyResetOtp.jsx
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const VerifyResetOtp = () => {
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const email = localStorage.getItem('resetEmail');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       await axios.post('/api/auth/verify-reset-otp', { email, otpInput: otp });
//       setTimeout(() => navigate('/reset-password'), 1000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Invalid OTP.');
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto mt-20 bg-white rounded-xl shadow-md space-y-6">
//       <h2 className="text-xl font-semibold">Verify OTP</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter OTP"
//           value={otp}
//           required
//           onChange={(e) => setOtp(e.target.value)}
//           className="w-full p-2 border rounded mb-4"
//         />
//         <button className="w-full py-2 bg-green-600 text-white rounded">Verify</button>
//       </form>
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default VerifyResetOtp;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/auth/verify-reset-otp', { email, otpInput: otp });
      setTimeout(() => {
        setLoading(false);
        navigate('/reset-password');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Invalid OTP.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-8 w-full max-w-md shadow-lg border border-white/10"
      >
        <div className="text-center space-y-3 mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3783/3783024.png"
            alt="otp"
            className="w-16 mx-auto drop-shadow"
          />
          <h2 className="text-3xl font-extrabold text-white">Verify Your OTP</h2>
          <p className="text-sm text-gray-300">
            Enter the 6-digit code sent to <span className="font-medium">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-400 dark:border-gray-600 bg-white/90 dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-center tracking-widest text-lg font-semibold"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        {error && (
          <div className="text-center mt-4 text-sm text-red-500 font-medium animate-pulse">
            {error}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Didn't get the code?{' '}
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-emerald-400 font-medium "
            >
              Resend OTP
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyResetOtp;
