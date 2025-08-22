import { useState } from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [user, setUser] = useState(null);
  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="flex flex-col items-center">
          <div>Welcome, {user.name}!</div>
          <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      )}
    </div>
  );
};

export default Login;
