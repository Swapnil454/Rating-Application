import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, User, Store, Mail, MapPin, Star, Clock, CheckCircle } from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userRatings, setUserRatings] = useState([]);
  const [ownedStores, setOwnedStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get(`/api/users/${id}`);
        const ratingsRes = await api.get(`/api/ratings/user/${id}`);
        
        setUserData(userRes.data);
        setUserRatings(ratingsRes.data || []);

        if (userRes.data.role === 'owner') {
          const storesRes = await api.get(`/api/stores?ownerId=${id}&limit=100`);
          setOwnedStores(storesRes.data.stores || []);
        }

      } catch {
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const ownerOverallRating = (() => {
    if (ownedStores.length === 0) return null;
    let totalAvg = 0;
    let totalCount = 0;
    ownedStores.forEach(s => {
      if (s.averageRating) {
        totalAvg += parseFloat(s.averageRating) * s.totalRatings;
        totalCount += s.totalRatings;
      }
    });
    return totalCount > 0 ? (totalAvg / totalCount).toFixed(1) : 'No Ratings';
  })();

  const containerFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.08 } },
  };

  const itemFade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  const getRoleBadge = (role) => {
    if (role === 'admin')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
          <Shield size={12} /> Admin
        </span>
      );
    if (role === 'owner')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Store size={12} /> Store Owner
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
        <User size={12} /> User
      </span>
    );
  };

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        className={s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-800 text-zinc-700'}
      />
    ));

  const avgUserRating =
    userRatings.length
      ? (userRatings.reduce((a, r) => a + r.rating, 0) / userRatings.length).toFixed(1)
      : null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-500" />
      </div>
    );

  if (error || !userData)
    return (
      <div className="min-h-screen pt-20 px-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl inline-block">
          {error || 'User not found'}
        </div>
        <div className="mt-4">
          <Link to="/users" className="text-zinc-400 hover:text-white transition-colors">
            ← Back to Users
          </Link>
        </div>
      </div>
    );

  return (
    <motion.div
      className="pt-16 pb-12 min-h-screen px-6 lg:px-12 text-zinc-100 font-sans"
      initial="hidden"
      animate="show"
      variants={containerFade}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div variants={itemFade} className="mb-6">
          <Link
            to="/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700/50"
          >
            <ArrowLeft size={14} /> Back to Users
          </Link>
        </motion.div>

        <motion.div
          variants={itemFade}
          className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-3xl p-8 shadow-lg mb-6"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-700 border border-zinc-600 flex items-center justify-center text-xl font-bold text-zinc-200">
                {userData.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{userData.name}</h1>
                <p className="text-zinc-400 text-sm">{userData.email}</p>
              </div>
            </div>
            {getRoleBadge(userData.role)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <Mail size={12} /> Email
              </div>
              <p className="text-sm text-zinc-200">{userData.email}</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <MapPin size={12} /> Address
              </div>
              <p className="text-sm text-zinc-200">{userData.address || '—'}</p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <CheckCircle size={12} /> Status
              </div>
              <p className={`text-sm font-semibold ${userData.isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {userData.isVerified ? '✓ Verified' : '⚠ Unverified'}
              </p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <Clock size={12} /> Member Since
              </div>
              <p className="text-sm text-zinc-200">
                {new Date(userData.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {userData.role === 'owner' && (
          <motion.div
            variants={itemFade}
            className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h2 className="text-base font-semibold text-amber-300 mb-2 flex items-center gap-2">
                <Store size={16} /> Store Owner
              </h2>
              <p className="text-zinc-400 text-sm">
                This user owns <span className="font-bold text-white">{ownedStores.length}</span> stores on the platform.
              </p>
            </div>
            
            <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl px-5 py-3 text-center shrink-0 min-w-[120px]">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Owner Rating</p>
              <div className="flex items-center justify-center gap-1.5">
                <Star className={`w-4 h-4 ${ownerOverallRating === 'No Ratings' || !ownerOverallRating ? 'text-zinc-600' : 'fill-amber-400 text-amber-400'}`} />
                <span className="text-xl font-bold text-white">
                  {ownerOverallRating || '—'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemFade}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" /> Ratings Submitted
            </h2>
            {avgUserRating && (
              <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 px-3 py-1.5 rounded-xl">
                <div className="flex gap-0.5">{renderStars(Math.round(avgUserRating))}</div>
                <span className="text-xs font-bold text-amber-400">{avgUserRating} avg</span>
                <span className="text-xs text-zinc-500">({userRatings.length} total)</span>
              </div>
            )}
          </div>

          {userRatings.length === 0 ? (
            <div className="py-12 text-center border border-zinc-700/50 border-dashed rounded-2xl bg-zinc-800/20">
              <p className="text-zinc-400 text-sm">This user has not submitted any ratings yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userRatings.map((r) => (
                <div
                  key={r._id}
                  className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm mb-1">{r.store?.name || 'Unknown Store'}</p>
                    {r.store?.address && (
                      <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
                        <MapPin size={10} />
                        {r.store.address}
                      </p>
                    )}
                    <div className="flex gap-0.5 mb-2">{renderStars(r.rating)}</div>
                    {r.review ? (
                      <p className="text-xs text-zinc-300 italic">"{r.review}"</p>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">No written review.</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-bold text-amber-400">{r.rating}</span>
                    <p className="text-[10px] text-zinc-500">/ 5</p>
                    <p className="text-[10px] text-zinc-600 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                    {r.isEdited && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 mt-1 inline-block">
                        Edited
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserDetail;
