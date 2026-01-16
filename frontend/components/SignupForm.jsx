import { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', form);
      setMessage(res.data.message || 'Signup successful!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 w-full" />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 w-full" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 w-full" />
      <select name="role" value={form.role} onChange={handleChange} className="border p-2 w-full">
        <option value="user">User</option>
        <option value="owner">Store Owner</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Signup</button>
      {message && <div className="mt-2 text-red-500">{message}</div>}
    </form>
  );
};

export default SignupForm;
