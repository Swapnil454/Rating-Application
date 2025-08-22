import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });

  const token = localStorage.getItem('token');

  const fetchUsers = useCallback(() => {
    const params = new URLSearchParams(filters).toString();
    axios
      .get(`/api/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, [filters, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className=" mt-10 p-6 md:p-10 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition">
      <h2 className="text-3xl font-bold mb-6">User Management</h2>

      {/* Filters Form */}
      <form
        onSubmit={handleSearch}
        className="grid md:grid-cols-5 gap-4 mb-8"
      >
        <input
          name="name"
          placeholder="Name"
          value={filters.name}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="email"
          placeholder="Email"
          value={filters.email}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="address"
          placeholder="Address"
          value={filters.address}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Store Owner</option>
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>

      {/* Users Display */}
      {users.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No users found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{user.address}</div>
              <div className="mt-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
