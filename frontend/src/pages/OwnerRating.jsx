import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Star, MessageSquareOff, Store, Clock, User } from 'lucide-react';

const OwnerRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await api.get('/api/ratings/owner');
        setRatings(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const containerFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.1 } },
  };

  const itemFade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        size={14}
        className={idx < rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-800 text-zinc-700'}
      />
    ));

  const averageRating = (() => {
    if (!ratings || ratings.length === 0) return null;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
  })();

  return (
    <motion.div
      className="pt-16 pb-12 min-h-screen px-6 lg:px-12 text-zinc-100 font-sans"
      initial="hidden"
      animate="show"
      variants={containerFade}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div variants={itemFade} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400/20" /> Store Feedback & Ratings
            </h1>
            <p className="text-zinc-400 text-sm">
              View all ratings and reviews left by users across all your stores.
            </p>
          </div>

          {averageRating && (
            <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Overall Rating</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white leading-none">{averageRating}</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5">{renderStars(Math.round(averageRating))}</div>
                    <span className="text-[10px] text-zinc-400 font-medium">Based on {ratings.length} reviews</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {error && (
          <motion.div
            variants={itemFade}
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-500" />
          </div>
        ) : ratings.length === 0 ? (
          <motion.div
            variants={itemFade}
            className="py-20 text-center border border-zinc-700/50 border-dashed rounded-2xl bg-zinc-800/20 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-zinc-700">
              <MessageSquareOff className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Ratings Yet</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              You haven't received any ratings or feedback on your stores yet.
            </p>
          </motion.div>
        ) : (
          <motion.div variants={itemFade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratings.map((r) => (
              <div
                key={r._id}
                className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-5 shadow-sm hover:border-zinc-600 transition-colors flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">{renderStars(r.rating)}</div>
                  {r.store && (
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-zinc-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800 max-w-[120px] truncate">
                      <Store size={10} />
                      <span className="truncate">{r.store.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  {r.review ? (
                    <p className="text-sm text-zinc-300 italic mb-4">"{r.review}"</p>
                  ) : (
                    <p className="text-sm text-zinc-500 italic mb-4">No written feedback provided.</p>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-700/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                      {r.user?.name?.charAt(0).toUpperCase() || <User size={12} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{r.user?.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-zinc-500">{r.user?.email || ''}</p>
                    </div>
                  </div>
                  {r.createdAt && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Clock size={10} />
                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OwnerRatings;
