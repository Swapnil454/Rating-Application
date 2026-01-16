// // pages/ForgotPassword.jsx
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     try {
//       const res = await axios.post('/api/auth/forgot-password', { email });
//       setMessage(res.data.message);
//       localStorage.setItem('resetEmail', email); // Store for next step
//       setTimeout(() => navigate('/verify-reset-otp'), 1500);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to send OTP.');
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto mt-20 bg-white rounded-xl shadow-md space-y-6">
//       <h2 className="text-xl font-semibold">Forgot Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           required
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border rounded mb-4"
//         />
//         <button className="w-full py-2 bg-blue-600 text-white rounded">Send OTP</button>
//       </form>
//       {message && <p className="text-green-600">{message}</p>}
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default ForgotPassword;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      localStorage.setItem('resetEmail', email);
      setTimeout(() => navigate('/verify-reset-otp'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-violet-900 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-lg shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md space-y-6 border border-white/20 dark:border-slate-800"
      >
        <h2 className="text-3xl font-bold text-center text-white dark:text-slate-100">
          🔐 Forgot Password
        </h2>

        <p className="text-sm text-center text-slate-300 dark:text-slate-400">
          Submit your registered email and we'll send you an OTP.
        </p>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Send OTP
        </button>

        {message && (
          <div className="text-center text-sm text-green-400 font-medium animate-pulse">
            {message}
          </div>
        )}
        {error && (
          <div className="text-center text-sm text-red-500 font-medium animate-pulse">
            {error}
          </div>
        )}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-violet-300 "
          >
            Back to Login
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
