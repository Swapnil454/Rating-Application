import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Users, Store, Star, BarChart2, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [stats, setStats] = useState({
    users: 0, stores: 0, ratings: 0, recentRatings: [],
    adminCount: 0, ownerCount: 0, userCount: 0
  });

  const [storeRatings, setStoreRatings] = useState([]);
  const [myRatingsCount, setMyRatingsCount] = useState(0);       
  const [ownerAvgRating, setOwnerAvgRating] = useState(null);   

  useEffect(() => {
    api.get('/api/ratings/average')
      .then(res => setStoreRatings(res.data))
      .catch(err => console.error('Failed to load store ratings:', err));

    api.get('/api/dashboard').then(res => {
      setStats(res.data);
      if (user.role === 'owner' && res.data.recentRatings?.length) {
        const total = res.data.recentRatings.reduce((a, r) => a + r.rating, 0);
        setOwnerAvgRating((total / res.data.recentRatings.length).toFixed(1));
      }
    }).catch(() => setStats({ users: 0, stores: 0, ratings: 0, recentRatings: [], adminCount: 0, ownerCount: 0, userCount: 0 }));

    const currentUserId = user?._id || user?.id;
    if (user.role === 'user' && currentUserId) {
      api.get(`/api/ratings/user/${currentUserId}`)
        .then(res => setMyRatingsCount(res.data?.length || 0))
        .catch(() => setMyRatingsCount(0));
    }
  }, [user.role, user._id, user.id]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const calculateAverageRating = () => {
    if (!storeRatings || storeRatings.length === 0) return "0.0";
    
    let validRatingsCount = 0;
    const sum = storeRatings.reduce((acc, curr) => {
      const rating = Number(curr.averageRating);
      if (!isNaN(rating) && rating > 0) {
        validRatingsCount++;
        return acc + rating;
      }
      return acc;
    }, 0);

    if (validRatingsCount === 0) return "0.0";
    return (sum / validRatingsCount).toFixed(1);
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Just now";
    const diff = new Date() - new Date(dateString);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const containerFade = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.05 } }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="pt-16 pb-12 min-h-screen px-6 lg:px-12 text-zinc-100 font-sans"
      initial="hidden"
      animate="show"
      variants={containerFade}
    >
      <div className="max-w-6xl mx-auto">
        
        <motion.div variants={itemFade} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 mt-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">
              Overview
            </h1>
            <p className="text-zinc-400 text-xs">
              {user.name || 'User'} · {user.role === 'admin' ? 'Admin' : user.role === 'owner' ? 'Store Owner' : 'User'} · {new Date().getFullYear()}
            </p>
          </div>
          
          <div className="flex gap-2">
            {(user.role === 'admin' || user.role === 'owner') && (
              <Link to="/manage-stores" className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-xs font-medium hover:bg-zinc-700 hover:text-white transition-all shadow-sm">
                <Store size={14} /> Manage stores
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/users" className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-xs font-medium hover:bg-zinc-700 hover:text-white transition-all shadow-sm">
                <Users size={14} /> Manage users
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemFade} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {user.role !== 'user' && (
            <>
              <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                    <Users size={14} />
                    <span className="text-xs font-medium">Total users</span>
                  </div>
                  <p className="text-3xl font-semibold text-white mb-2">{stats.users}</p>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">
                  <span className="text-zinc-400">□ No change this week</span>
                </p>
              </div>
              
              <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                    <Store size={14} />
                    <span className="text-xs font-medium">Total stores</span>
                  </div>
                  <p className="text-3xl font-semibold text-white mb-2">{stats.stores}</p>
                </div>
                <p className="text-[10px] font-medium">
                  <span className="text-emerald-400">+1 this week</span>
                </p>
              </div>
              
              <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                    <Star size={14} />
                    <span className="text-xs font-medium">Total ratings</span>
                  </div>
                  <p className="text-3xl font-semibold text-white mb-2">{stats.ratings}</p>
                </div>
                <p className="text-[10px] font-medium">
                  <span className="text-emerald-400">+3 this week</span>
                </p>
              </div>
              
              <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                    <BarChart2 size={14} />
                    <span className="text-xs font-medium">Avg. rating</span>
                  </div>
                  <p className="text-3xl font-semibold text-white mb-2">{calculateAverageRating()}</p>
                </div>
                <p className="text-[10px] font-medium">
                  <span className="text-emerald-400">+0.2 vs last month</span>
                </p>
              </div>
            </>
          )}

          {user.role === 'user' && (
            <>
              <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-2 md:col-span-2">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-400 mb-2">
                    <Star size={14} />
                    <span className="text-xs font-medium">My Ratings</span>
                  </div>
                  <p className="text-3xl font-semibold text-white mb-2">
                    {myRatingsCount}
                  </p>
                </div>
                <p className="text-[10px] font-medium">
                  <span className="text-zinc-500">Total stores rated</span>
                </p>
              </div>
            </>
          )}
        </motion.div>

        {user.role === 'admin' && (
          <motion.div variants={itemFade} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium mb-0.5">Admins</p>
                <p className="text-xl font-semibold text-white">{stats.adminCount}</p>
              </div>
            </div>
            
            <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Store size={18} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium mb-0.5">Store owners</p>
                <p className="text-xl font-semibold text-white">{stats.ownerCount}</p>
              </div>
            </div>
            
            <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <User size={18} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium mb-0.5">Regular users</p>
                <p className="text-xl font-semibold text-white">{stats.userCount}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemFade} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {user.role !== 'user' && (
            <div className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-semibold text-white tracking-tight">Store performance</h3>
                <span className="text-[11px] font-medium text-zinc-500 bg-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-700">Top 6 by rating</span>
              </div>
              
              <div className="space-y-4">
                {storeRatings.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-2">No store ratings yet.</p>
                ) : (
                  storeRatings.slice(0, 6).map((store, i) => {
                    const rating = Number(store.averageRating || 0);
                    return (
                      <div key={store._id || i} className="flex items-center gap-4">
                        <p className="text-xs font-medium text-zinc-200 w-32 truncate">{store.name}</p>
                        <div className="flex-1 h-2 bg-zinc-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-zinc-300 rounded-full" 
                            style={{ width: `${(rating / 5) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 w-14 justify-end">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs text-amber-400 font-semibold">{rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-zinc-300 font-semibold w-6 text-right">{rating.toFixed(1)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div className={`bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-5 shadow-sm ${user.role === 'user' ? 'lg:col-span-2' : ''}`}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-semibold text-white tracking-tight">{user.role === 'user' ? 'My Recent Reviews' : 'Recent activity'}</h3>
              <span className="text-[11px] font-medium text-zinc-500 bg-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-700">Ledger</span>
            </div>
            
            <div className="space-y-0">
              {(!stats.recentRatings || stats.recentRatings.length === 0) ? (
                <p className="text-xs text-zinc-500 text-center py-2">No recent activity.</p>
              ) : (
                (user.role === 'user' ? stats.recentRatings.filter(r => r.user?._id === (user._id || user.id) || r.user === (user._id || user.id)) : stats.recentRatings).slice(0, 6).map((r, i) => (
                  <div key={r._id || i} className="flex items-start gap-3 border-b border-zinc-700/50 last:border-0 py-3.5 first:pt-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 text-zinc-200 flex items-center justify-center font-semibold text-[10px] shrink-0 border border-zinc-600">
                      {getInitials(r.user?.name)}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs text-zinc-300 mb-1 leading-relaxed">
                        <span className="font-semibold text-white">{r.user?.name}</span> rated <span className="font-semibold text-white">{r.store?.name}</span>
                      </p>
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={12} 
                            className={star <= r.rating ? "text-amber-400 fill-amber-400" : "text-zinc-600 fill-zinc-600"} 
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-medium text-zinc-500">
                        {formatRelativeTime(r.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
