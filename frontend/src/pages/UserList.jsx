import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Users as UsersIcon, Shield, Store, User, ArrowLeft, ArrowRight, ArrowDownUp, ChevronDown, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ value, options, onChange, icon: Icon, placeholder, className, isSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10 pointer-events-none" />}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all shadow-sm flex items-center justify-between ${Icon ? 'pl-9 pr-4' : 'px-4'} ${!selectedOption && placeholder ? 'text-zinc-400' : 'text-zinc-200'}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden ${isSort ? 'right-0 w-48' : 'w-full'}`}
          >
            {placeholder && !isSort && (
               <button
                  type="button"
                  onClick={() => { onChange(''); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === '' ? 'bg-zinc-700/50 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-200'}`}
               >
                 {placeholder}
               </button>
            )}
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt.value ? 'bg-zinc-700/50 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0, filteredUsers: 0 });
  const [isTyping, setIsTyping] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 12
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    setIsTyping(true);
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsTyping(false);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [filters]);

  const fetchUsers = useCallback(() => {
    const params = new URLSearchParams(debouncedFilters).toString();
    api
      .get(`/api/users?${params}`)
      .then((res) => {
        setUsers(res.data.users || []);
        setPagination({
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1,
          totalUsers: res.data.totalUsers || 0,
          filteredUsers: res.data.filteredUsers !== undefined ? res.data.filteredUsers : res.data.totalUsers || 0
        });
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
        setUsers([]);
      });
  }, [debouncedFilters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    setFilters(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value,
      page: 1 
    }));
  };

  const handleRoleChange = (val) => {
    setFilters(prev => ({ ...prev, role: val, page: 1 }));
  };

  const handleSortChange = (value) => {
    let sortBy = 'createdAt';
    let order = 'desc';
    
    if (value === 'newest') { sortBy = 'createdAt'; order = 'desc'; }
    if (value === 'oldest') { sortBy = 'createdAt'; order = 'asc'; }
    if (value === 'nameAsc') { sortBy = 'name'; order = 'asc'; }
    if (value === 'nameDesc') { sortBy = 'name'; order = 'desc'; }
    if (value === 'emailAsc') { sortBy = 'email'; order = 'asc'; }
    if (value === 'emailDesc') { sortBy = 'email'; order = 'desc'; }

    setFilters(prev => ({ ...prev, sortBy, order, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const containerFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.05 } }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold whitespace-nowrap"><Shield size={12}/> Admin</span>;
      case 'owner': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold whitespace-nowrap"><Store size={12}/> Owner</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold whitespace-nowrap"><User size={12}/> User</span>;
    }
  };

  const sortValue = filters.sortBy === 'createdAt' && filters.order === 'desc' ? 'newest' : 
                    filters.sortBy === 'createdAt' && filters.order === 'asc' ? 'oldest' : 
                    filters.sortBy === 'name' && filters.order === 'asc' ? 'nameAsc' : 
                    filters.sortBy === 'name' && filters.order === 'desc' ? 'nameDesc' :
                    filters.sortBy === 'email' && filters.order === 'asc' ? 'emailAsc' : 'emailDesc';

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'nameAsc', label: 'Name (A-Z)' },
    { value: 'nameDesc', label: 'Name (Z-A)' },
    { value: 'emailAsc', label: 'Email (A-Z)' },
    { value: 'emailDesc', label: 'Email (Z-A)' },
  ];

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'owner', label: 'Store Owner' },
  ];

  return (
    <motion.div
      className="pt-16 pb-12 min-h-screen px-6 lg:px-12 text-zinc-100 font-sans"
      initial="hidden"
      animate="show"
      variants={containerFade}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemFade} className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-3">
              <UsersIcon className="w-8 h-8 text-zinc-400" /> User Management
            </h1>
            <p className="text-zinc-400 text-sm">View and manage all registered users on the platform.</p>
          </div>
          <div className="flex items-center gap-3 relative z-30">
            <Link
              to="/users/new"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-200 text-zinc-900 hover:bg-white text-sm font-semibold shadow-sm transition-all"
            >
              <UserPlus size={16} /> Add User
            </Link>
            <CustomSelect
              value={sortValue}
              options={sortOptions}
              onChange={handleSortChange}
              icon={ArrowDownUp}
              isSort={true}
              className="w-48"
            />
          </div>
        </motion.div>

        <motion.div variants={itemFade} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8 relative z-20">
          <input
            name="name"
            placeholder="Filter by Name..."
            value={filters.name}
            onChange={handleChange}
            className="w-full bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all shadow-sm"
          />
          <input
            name="email"
            placeholder="Filter by Email..."
            value={filters.email}
            onChange={handleChange}
            className="w-full bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all shadow-sm"
          />
          <input
            name="address"
            placeholder="Filter by Address..."
            value={filters.address}
            onChange={handleChange}
            className="w-full bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all shadow-sm"
          />
          <CustomSelect
            value={filters.role}
            options={roleOptions}
            onChange={handleRoleChange}
            placeholder="All Roles"
          />
        </motion.div>

        {users.length === 0 ? (
          <motion.p variants={itemFade} className="text-zinc-500 text-sm text-center py-10 bg-zinc-800/20 rounded-2xl border border-zinc-700/30 border-dashed">
            {isTyping ? "Searching..." : "No users found matching your criteria."}
          </motion.p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {users.map((user) => (
              <Link
                to={`/users/${user._id}`}
                key={user._id}
                className={`bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-5 shadow-sm transition-all ${isTyping ? 'opacity-50' : 'opacity-100'} group hover:border-zinc-500 hover:bg-zinc-800/80 flex flex-col justify-between cursor-pointer`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-white truncate pr-2" title={user.name}>{user.name}</h3>
                    {getRoleBadge(user.role)}
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-zinc-400 truncate" title={user.email}>{user.email}</p>
                    {user.address && <p className="text-xs text-zinc-500 truncate" title={user.address}>{user.address}</p>}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-600 mt-3 group-hover:text-zinc-500 transition-colors">Click to view details →</p>
              </Link>
            ))}
          </div>
        )}

        {users.length > 0 && (
          <motion.div variants={itemFade} className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-zinc-800/40 rounded-2xl border border-zinc-700/50 gap-4">
            <span className="text-sm text-zinc-400">
              Showing <span className="text-white font-medium">{users.length}</span> of <span className="text-white font-medium">{pagination.filteredUsers}</span> users
              {pagination.filteredUsers !== pagination.totalUsers && (
                <span className="ml-1 text-zinc-500">(filtered from {pagination.totalUsers} total overall records)</span>
              )}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={16} /> Prev
              </button>
              <div className="flex items-center px-4 text-sm font-medium text-zinc-300 bg-zinc-900/50 rounded-xl border border-zinc-700/30">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserList;
