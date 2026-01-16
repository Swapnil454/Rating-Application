import { useState, useEffect } from 'react';
import api from '../api/axios';
import RatingForm from '../components/RatingForm';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const token = localStorage.getItem('token');

  const fetchStores = () => {
    const params = new URLSearchParams(filters).toString();
    api.get(`/api/stores?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStores(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Failed to fetch stores:', err);
        setStores([]);
      });
  };

  useEffect(() => {
    fetchStores();
  }, [token]);

  const handleChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = e => {
    e.preventDefault();
    fetchStores();
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Stores</h2>
      <form onSubmit={handleSearch} className="mb-4 space-x-2">
        <input name="name" placeholder="Name" value={filters.name} onChange={handleChange} className="border p-2" />
        <input name="address" placeholder="Address" value={filters.address} onChange={handleChange} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Search</button>
      </form>
      <div className="space-y-6">
        {(stores || []).map(store => (
          <div key={store._id} className="border p-4 rounded">
            <div className="font-semibold">{store.name}</div>
            <div className="text-gray-600">{store.address}</div>
            <RatingForm storeId={store._id} token={token} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
