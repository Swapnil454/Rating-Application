import { useState } from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [user, setUser] = useState(null);
  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    setUser(user);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {!user ? <LoginForm onLogin={handleLogin} /> : <div>Welcome, {user.name}!</div>}
    </div>
  );
};

export default Login;
