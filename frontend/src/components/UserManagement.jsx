import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { UserPlus, Edit3, Trash } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchUsers = () => {
    api.get('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data || []))
      .catch(err => {
        console.error('Failed to fetch users:', err);
        setUsers([]);
      });
  };

  useEffect(() => { fetchUsers(); }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/users/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post('/api/users', form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ name: '', email: '', address: '', password: '', role: 'user' });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleEdit = user => {
    setEditId(user._id);
    setForm({ name: user.name, email: user.email, address: user.address, password: '', role: user.role });
  };

  const handleDelete = async id => {
    await api.delete(`/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  return (
    <div className=" mt-20 p-6 max-w-4xl mx-auto">
      <motion.h2 className="text-2xl font-bold mb-4 text-center flex items-center gap-2 justify-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <UserPlus className="w-6 h-6" /> {editId ? 'Edit User' : 'Create New User'}
      </motion.h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
            className="input-style" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="input-style" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange}
            className="input-style" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
            className="input-style" />
          <select name="role" value={form.role} onChange={handleChange}
            className="input-style text-gray-700 dark:text-white">
            <option value="user">👤 User</option>
            <option value="owner">🏪 Store Owner</option>
            <option value="admin">🛡️ Admin</option>
          </select>
        </div>
        <button type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white py-2 px-4 rounded-lg font-medium transition duration-200">
          {editId ? 'Update User' : 'Create User'}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {(users || []).map(user => (
          <motion.div key={user._id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{user.address}</div>
              <div className="text-sm font-medium mt-1 text-blue-600 dark:text-blue-400">Role: {user.role}</div>
            </div>
            <div className="flex space-x-2">
  <button
    onClick={() => handleEdit(user)}
    className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:opacity-90 transition"
    title="Edit"
  >
    <Edit3 size={18} />
  </button>
  <button
    onClick={() => handleDelete(user._id)}
    className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:opacity-90 transition"
    title="Delete"
  >
    <Trash size={18} />
  </button>
</div>

          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
