import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, AlertCircle } from 'lucide-react';

const RatingForm = ({ storeId, token, isOwner }) => {
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(null);
  const [message, setMessage] = useState('');
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);
  const [error, setError] = useState('');

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`/api/ratings/store/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(res.data.ratings);
      setAverage(res.data.average);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading ratings');
    }
  };

  useEffect(() => {
    if (isOwner) fetchRatings();
  }, [storeId, token, isOwner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/ratings',
        { store: storeId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Rating submitted!');
      setTimeout(() => setMessage(''), 3000);
      if (isOwner) fetchRatings();
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Error');
    }
  };

  return (
    <div className="mt-2 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-md space-y-6 transition">
      {!isOwner && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Your Rating:</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <Star
                  key={val}
                  className={`w-6 h-6 cursor-pointer transition ${
                    (hoverRating || rating) >= val
                      ? 'text-yellow-400'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                  onClick={() => setRating(val)}
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(null)}
                  fill={(hoverRating || rating) >= val ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Submit Rating
          </button>

          {message && (
            <div className="text-sm text-green-500 mt-2">{message}</div>
          )}
        </form>
      )}

      {isOwner && (
        <>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Store Ratings Overview
          </h2>

          {error && (
            <div className="flex items-center text-red-500 gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {average !== null && (
            <div className="text-lg font-semibold">
              ⭐ Average Rating: <span className="text-yellow-500">{average}</span>
            </div>
          )}

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {ratings.map((r, i) => (
              <li key={i} className="py-4">
                <div className="font-medium">
                  {r.user.name} ({r.user.email})
                </div>
                <div>
                  Rating:{' '}
                  {[...Array(r.rating)].map((_, index) => (
                    <Star
                      key={index}
                      className="inline w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default RatingForm;
