import { useState, useEffect } from 'react';
import axios from 'axios';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', owner: '' });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchStores = () => {
    axios.get('/api/stores', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStores(res.data));
  };

  useEffect(() => { fetchStores(); }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/stores/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post('/api/stores', form, { headers: { Authorization: `Bearer ${token}` } });
    }
    setForm({ name: '', email: '', address: '', owner: '' });
    setEditId(null);
    fetchStores();
  };

  const handleEdit = store => {
    setEditId(store._id);
    setForm({ name: store.name, email: store.email, address: store.address, owner: store.owner });
  };

  const handleDelete = async id => {
    await axios.delete(`/api/stores/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchStores();
  };

  return (
    <div className=" mt-10 max-w-4xl mx-auto px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 transition-all"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {editId ? 'Update Store' : 'Create New Store'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Store Name"
            value={form.name}
            onChange={handleChange}
            className="bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
          />
          <input
            name="owner"
            placeholder="Owner User ID"
            value={form.owner}
            onChange={handleChange}
            className="bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 px-6 rounded-xl hover:scale-105 transition-transform duration-200"
        >
          {editId ? 'Update Store' : 'Create Store'}
        </button>
      </form>

      <div className="mt-8 space-y-6">
        {stores.map(store => (
          <div
            key={store._id}
            className="group border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg p-5 transition-all hover:shadow-xl hover:border-pink-400"
          >
            <div className="text-lg font-bold text-gray-800 dark:text-white">{store.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{store.email}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{store.address}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 italic">Owner ID: {store.owner}</div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleEdit(store)}
                className="text-yellow-600 hover:underline font-medium"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(store._id)}
                className="text-red-600 hover:underline font-medium"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreManagement;
