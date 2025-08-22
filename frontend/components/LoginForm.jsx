import { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      setMessage('Login successful!');
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  onLogin(res.data.token, res.data.user);
  window.location.href = '/dashboard';
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
      {message && <div className="mt-2 text-red-500">{message}</div>}
    </form>
  );
};

export default LoginForm;
