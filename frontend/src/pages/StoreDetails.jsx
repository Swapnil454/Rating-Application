import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { MapPin, Star, User, Clock, ArrowLeft, Phone, Globe, AlignLeft } from 'lucide-react';

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const fetchDetails = async () => {
    try {
      const [storeRes, ratingsRes] = await Promise.all([
        api.get(`/api/stores/${id}`),
        api.get(`/api/ratings/store/${id}`),
      ]);

      setStore(storeRes.data);

      const fetchedRatings = ratingsRes.data.ratings || [];
      setRatings(fetchedRatings);

      const currentUserId = user._id || user.id;
      const existing = fetchedRatings.find(r => r.user?._id === currentUserId || r.user === currentUserId);
      if (existing) {
        setMyRating(existing.rating);
        setMyReview(existing.review || '');
      }
    } catch {
      setError('Failed to load store details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const submitRating = async () => {
    if (!myRating) return;
    setSubmitting(true);
    try {
      await api.post('/api/ratings', { store: id, rating: myRating, review: myReview });
      showToast('Review submitted successfully!');
      fetchDetails();
    } catch {
      showToast('Failed to submit rating.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-2 pb-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-500" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen pt-20 px-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl inline-block">
          {error || 'Store not found'}
        </div>
        <div className="mt-4">
          <Link to="/stores" className="text-zinc-400 hover:text-white transition-colors">
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = ratings.length
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  return (
    <motion.div
      className="pt-16 pb-12 min-h-screen px-6 lg:px-12 text-zinc-100 font-sans"
      initial="hidden"
      animate="show"
      variants={containerFade}
    >
      <Helmet>
        <title>{store.name} - Rating App</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div variants={itemFade} className="mb-6">
          <Link
            to="/stores"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700/50"
          >
            <ArrowLeft size={14} /> Back to Explore
          </Link>
        </motion.div>

        <motion.div variants={itemFade} className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-3xl p-8 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {store.category && (
                  <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                    {store.category}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-4">{store.name}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>{store.address}</span>
                </div>
                {store.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    <span>{store.phone}</span>
                  </div>
                )}
                {store.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-zinc-500" />
                    <a
                      href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline"
                    >
                      {store.website}
                    </a>
                  </div>
                )}
              </div>

              {store.description && (
                <div className="mt-6 pt-6 border-t border-zinc-700/50">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" /> About this store
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{store.description}</p>
                </div>
              )}
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[160px] shrink-0">
              <div className="text-4xl font-bold text-white mb-2">{averageRating}</div>
              <div className="flex gap-1 mb-2">{renderStars(Math.round(averageRating))}</div>
              <p className="text-xs text-zinc-500 font-medium">
                {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemFade}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" /> Customer Reviews
            </h2>
          </div>

          {user.role === 'user' && (
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-300 tracking-wider mb-4">
                {myRating ? 'UPDATE YOUR REVIEW' : 'WRITE A REVIEW'}
              </h3>

              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() => setMyRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`cursor-pointer transition-all ${
                      (hoverRating || myRating) >= star
                        ? 'fill-amber-400 text-amber-400 scale-110'
                        : 'text-zinc-600 hover:text-zinc-500'
                    }`}
                  />
                ))}
              </div>

              <textarea
                placeholder="Share your experience (optional)..."
                value={myReview}
                onChange={(e) => setMyReview(e.target.value)}
                maxLength={500}
                className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-zinc-600 outline-none transition-all resize-none h-24 mb-4"
              />

              <div className="flex justify-end">
                <button
                  onClick={submitRating}
                  disabled={!myRating || submitting}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    myRating && !submitting
                      ? 'bg-zinc-200 text-zinc-900 hover:bg-white shadow-sm'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                  }`}
                >
                  {submitting ? 'Saving...' : 'Submit Review'}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratings.length === 0 ? (
              <div className="col-span-full py-12 text-center border border-zinc-700/50 border-dashed rounded-2xl bg-zinc-800/20">
                <p className="text-zinc-400 text-sm">No reviews yet. Be the first to rate this store!</p>
              </div>
            ) : (
              ratings.map((r) => (
                <div
                  key={r._id}
                  className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-5 shadow-sm hover:border-zinc-600 transition-colors flex flex-col h-full relative"
                >
                  {r.isEdited && (
                    <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      Edited
                    </span>
                  )}

                  <div className="flex gap-1 mb-3">{renderStars(r.rating)}</div>

                  <div className="flex-grow">
                    {r.review ? (
                      <p className="text-sm text-zinc-300 italic mb-4 leading-relaxed">"{r.review}"</p>
                    ) : (
                      <p className="text-sm text-zinc-500 italic mb-4">No written feedback provided.</p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-zinc-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 border border-zinc-600">
                        {r.user?.name?.charAt(0).toUpperCase() || <User size={12} />}
                      </div>
                      <p className="text-xs font-semibold text-zinc-200">{r.user?.name || 'Anonymous'}</p>
                    </div>
                    {r.updatedAt && (
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
                        <Clock size={10} />
                        {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {toast.show && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className={`fixed top-24 right-6 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 border backdrop-blur-md font-medium text-sm ${
            toast.type === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StoreDetails;
