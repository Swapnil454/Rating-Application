import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Moon, Users2, Store, Star, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [stats, setStats] = useState({
    users: 0, stores: 0, ratings: 0, recentRatings: [],
    adminCount: 0, ownerCount: 0, userCount: 0
  });

  const [storeRatings, setStoreRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    axios.get('/api/ratings/average', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStoreRatings(res.data))
      .catch(err => console.error('Failed to load store ratings:', err));

    axios.get('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data))
      .catch(() => setStats({
        users: 0, stores: 0, ratings: 0, recentRatings: [],
        adminCount: 0, ownerCount: 0, userCount: 0
      }));
  }, [token]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.6 }
    })
  };

  const Card = ({ icon: Icon, title, value }) => (
    <motion.div
      variants={fadeUp}
      className="bg-white dark:bg-slate-800 dark:border-slate-700 border border-gray-200 shadow rounded-xl p-5 flex items-center gap-4"
    >
      <div className="p-3 bg-blue-600 text-white rounded-xl">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-sm text-gray-600 dark:text-gray-300 font-medium">{title}</h4>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );

  const filteredRatings = stats.recentRatings.filter(r => {
    const userMatch = r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const storeMatch = r.store?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const ratingMatch = String(r.rating).includes(searchTerm);
    return userMatch || storeMatch || ratingMatch;
  });

  return (
    <motion.div
      className=" mt-20 min-h-screen px-6 py-8  bg-gray-50 dark:bg-slate-900 transition-colors"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h2 variants={fadeUp} className="text-3xl font-bold text-slate-800 dark:text-white">
          Dashboard
        </motion.h2>
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full"
          title="Toggle dark mode"
          variants={fadeUp}
        >
          {darkMode ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-slate-800" />}
        </motion.button>
      </div>

      <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-300 mb-8">
        Welcome, <span className="font-semibold">{user.name || 'User'}</span> ({user.role || 'role'})
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card icon={Users2} title="Total Users" value={stats.users} />
        <Card icon={Store} title="Total Stores" value={stats.stores} />
        <Card icon={Star} title="Total Ratings" value={stats.ratings} />
        <Card icon={BarChart3} title="Admins / Owners / Users" value={`${stats.adminCount} / ${stats.ownerCount} / ${stats.userCount}`} />
      </div>

      <motion.div variants={fadeUp} className="mb-10">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">📊 Top Rated Stores</h3>
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
          <ResponsiveContainer width="30%" height={300}>
            <BarChart data={storeRatings.slice(0, 5)}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="averageRating" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-10">
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">🕒 Recent Ratings</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {filteredRatings.length === 0 ? (
              <li>No matching ratings.</li>
            ) : (
              filteredRatings.map(r => (
                <li key={r._id}>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{r.user?.name}</span> rated
                  <span className="font-medium text-green-600 dark:text-green-400"> {r.store?.name}</span>: 
                  <span className="font-bold text-yellow-600 dark:text-yellow-400"> {r.rating}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
        <a href="/stores" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          Manage Stores
        </a>
        <a href="/users" className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
          Manage Users
        </a>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
