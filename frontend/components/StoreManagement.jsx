import { useState, useEffect } from 'react';
import axios from 'axios';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', owner: '' });
  const [editId, setEditId] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  console.log("User:", user);
  console.log("Token:", token);

  const fetchStores = () => {
    axios.get('/api/stores', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStores(res.data));
  };

  useEffect(() => { fetchStores(); }, [token]);

  useEffect(() => {
    if (user.role === 'admin' && token) {
      axios.get('http://localhost:8786/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => setUsers(res.data))
        .catch(err => {
          setUsers([]);
          console.error("Error fetching users:", err);
        });
    }
  }, [token, user.role]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await axios.put(`/api/stores/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/stores', form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ name: '', email: '', address: '', owner: '' });
      setEditId(null);
      fetchStores();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred.');
      }
    }
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
    <div>
      {user.role !== 'admin' && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          Only admins can create stores. You can view stores below.
        </div>
      )}
      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 w-full" disabled={user.role !== 'admin'} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" disabled={user.role !== 'admin'} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 w-full" disabled={user.role !== 'admin'} />
        {user.role === 'admin' ? (
          <select name="owner" value={form.owner} onChange={handleChange} className="border p-2 w-full" required>
            <option value="">Select Owner</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        ) : (
          <input name="owner" placeholder="Owner User ID" value={form.owner} onChange={handleChange} className="border p-2 w-full" disabled />
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2" disabled={user.role !== 'admin'}>{editId ? 'Update' : 'Create'} Store</button>
      </form>
      <div className="space-y-4">
        {stores.map(store => (
          <div key={store._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{store.name}</div>
              <div>{store.email}</div>
              <div>{store.address}</div>
              <div>Owner: {store.owner}</div>
            </div>
            <div>
              <button onClick={() => handleEdit(store)} className="mr-2 text-yellow-600" disabled={user.role !== 'admin'}>Edit</button>
              <button onClick={() => handleDelete(store._id)} className="text-red-600" disabled={user.role !== 'admin'}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreManagement;
