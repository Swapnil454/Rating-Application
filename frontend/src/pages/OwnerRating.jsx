import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const OwnerRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchRatings = async () => {
      try {
        const res = await api.get('/api/ratings/owner', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRatings(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch ratings');
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users Who Rated Your Store</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="min-w-full border border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">User Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((r) => (
            <tr key={r._id}>
              <td className="border px-4 py-2">{r.user.name}</td>
              <td className="border px-4 py-2">{r.user.email}</td>
              <td className="border px-4 py-2">{r.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerRatings;
