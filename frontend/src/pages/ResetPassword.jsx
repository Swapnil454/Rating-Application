// // pages/ResetPassword.jsx
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ResetPassword = () => {
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const email = localStorage.getItem('resetEmail');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');

//     try {
//       await axios.post('/api/auth/reset-password', { email, newPassword: password });
//       setMessage('Password reset successful. Redirecting to login...');
//       setTimeout(() => {
//         localStorage.removeItem('resetEmail');
//         navigate('/login');
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Reset failed.');
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto mt-20 bg-white rounded-xl shadow-md space-y-6">
//       <h2 className="text-xl font-semibold">Reset Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="New Password"
//           value={password}
//           required
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded mb-4"
//         />
//         <button className="w-full py-2 bg-indigo-600 text-white rounded">Update Password</button>
//       </form>
//       {message && <p className="text-green-600">{message}</p>}
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default ResetPassword;

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem('resetEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      return setError('❌ Passwords do not match.');
    }

    try {
      await axios.post('/api/auth/reset-password', { email, newPassword: password });
      setMessage('✅ Password reset successful. Redirecting...');
      setTimeout(() => {
        localStorage.removeItem('resetEmail');
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f1f47] via-[#2c2c72] to-[#3b3b95] dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-lg shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md space-y-6 border border-white/20 dark:border-slate-800"
      >
        <h2 className="text-3xl font-bold text-center text-white dark:text-slate-200 mb-2">
          🔒 Reset Password
        </h2>

        <p className="text-sm text-center text-slate-200 dark:text-slate-400 mb-4">
          Enter and confirm your new password
        </p>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:shadow-lg transition"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:shadow-lg transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          🔁 Update Password
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

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-indigo-300"
          >
            🔙 Back to Login
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ResetPassword;
