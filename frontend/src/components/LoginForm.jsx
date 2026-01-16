// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';

// const LoginForm = ({ onLogin }) => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = e =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/auth/login', form);
//       setMessage('Login successful!');
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user));
//       onLogin(res.data.token, res.data.user);
//       navigate('/dashboard');
//     } catch (err) {
//       setMessage(err.response?.data?.error || 'Login failed.');
//     }
//   };

//   return (
//     <div className=" w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-900 dark:from-gray-900 dark:to-gray-800 p-4">
//       <motion.form
//         onSubmit={handleSubmit}
//         initial={{ opacity: 0, scale: 0.95, y: 40 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: 'easeOut' }}
//         className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-white/20 dark:border-slate-800"
//       >
//         <h2 className="text-3xl font-bold text-center text-white dark:text-slate-200">
//           🔐 Login
//         </h2>

//         <div className="space-y-4">
//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
          
//         </div>

//         <button
//           type="submit"
//           className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
//         >
//           Sign In
//         </button>

//         {message && (
//           <div className="text-center text-sm text-red-500 font-medium">
//             {message}
//           </div>
//         )}
//       </motion.form>
//     </div>
//   );
// };

// export default LoginForm;


// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';

// // const LoginForm = ({ onLogin }) => {
// //   const [form, setForm] = useState({ email: '', password: '' });
// //   const [error, setError] = useState('');
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await axios.post('/api/auth/login', form);
// //       onLogin(res.data.token, res.data.user);
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Login failed');
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-4">
// //       <input
// //         name="email"
// //         type="email"
// //         placeholder="Email"
// //         value={form.email}
// //         onChange={handleChange}
// //         className="w-full px-4 py-2 border rounded"
// //       />
// //       <input
// //         name="password"
// //         type="password"
// //         placeholder="Password"
// //         value={form.password}
// //         onChange={handleChange}
// //         className="w-full px-4 py-2 border rounded"
// //       />
// //       {error && <p className="text-red-500 text-sm">{error}</p>}
// //       <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
// //       <p
// //         className="text-blue-500 text-sm underline cursor-pointer"
// //         onClick={() => navigate('/forgot-password')}
// //       >
// //         Forgot Password?
// //       </p>
// //     </form>
// //   );
// // };

// // export default LoginForm;


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', form);
      setMessage('Login successful!');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-900 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-white/20 dark:border-slate-800"
      >
        <h2 className="text-3xl font-bold text-center text-white dark:text-slate-200">
          🔐 Login
        </h2>

        <div className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* 🔗 Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-300 "
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Sign In
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

export default LoginForm;
