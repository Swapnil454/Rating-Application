import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', show: true },
    { name: 'Explore', path: '/stores', show: true },
    { name: 'Dashboard', path: '/dashboard', show: true },
    { name: 'Users', path: '/users', show: user?.role === 'admin' },
    { name: 'Stores', path: '/manage-stores', show: user?.role === 'admin' },
    { name: 'My Ratings', path: '/owner/ratings', show: user?.role === 'owner' },
  ];

  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="w-full max-w-5xl bg-dark-900/90 border border-white/10 rounded-full backdrop-blur-md px-6 py-3 pointer-events-auto flex justify-between items-center transition-all duration-300 shadow-2xl">
        
        <Link to="/" className="flex items-center gap-2 group">
          <span 
            className="text-2xl text-white tracking-wide group-hover:text-arcova-gold transition-colors"
            style={{ fontFamily: "'Pacifico', cursive", paddingTop: '4px' }}
          >
            Rating App
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.filter(link => link.show).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`pb-1 text-sm font-medium transition-all border-b-2 ${
                location.pathname === link.path
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="text-xs font-bold uppercase tracking-widest bg-arcova-gold text-arcova-dark px-6 py-2.5 rounded-full hover:bg-arcova-goldHover transition-all">
                Sign up
              </Link>
            </>
          ) : (
             <div className="flex items-center space-x-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <div className="w-8 h-8 rounded-full bg-[#1e293b] text-blue-400 flex items-center justify-center font-bold text-[10px] border border-blue-500/20">
                  {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium text-gray-200">
                  {user.name}
                </span>
              </div>
              <Link
                to="/change-password"
                className="text-[11px] uppercase tracking-widest font-bold text-gray-400 hover:text-arcova-gold transition-colors"
              >
                Change Password
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium border border-red-900/50 text-red-400 px-4 py-2 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-400 hover:text-white focus:outline-none p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="absolute top-16 left-4 right-4 bg-dark-800 border border-white/10 rounded-2xl p-4 flex flex-col space-y-2 pointer-events-auto md:hidden shadow-2xl">
          {navLinks.filter(link => link.show).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium ${
                location.pathname === link.path
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <hr className="border-gray-800 my-2" />

          {!user ? (
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-arcova-gold text-arcova-dark text-center hover:bg-arcova-goldHover mt-2"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2">
               <div className="px-4 py-2 text-sm text-gray-400">
                 Signed in as <span className="text-white font-medium">{user.name}</span>
               </div>
              <Link
                to="/change-password"
                onClick={() => setOpen(false)}
                className="text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5"
              >
                Change Password
              </Link>
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
}
