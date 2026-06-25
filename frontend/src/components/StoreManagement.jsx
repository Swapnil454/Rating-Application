import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Plus, Edit2, Trash2, MapPin, Phone, Globe, Tag, AlignLeft, User, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  'General', 'Restaurant', 'Retail', 'Services', 
  'Electronics', 'Grocery', 'Fashion', 'Health & Beauty', 
  'Home & Garden', 'Automotive', 'Entertainment', 'Others'
];

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={selectRef}>
      <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500 z-10" />
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl pl-10 pr-10 py-3 text-sm text-zinc-200 cursor-pointer flex items-center justify-between hover:border-zinc-500 transition-colors"
      >
        <span>{value || 'Select Category'}</span>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  value === option 
                    ? 'bg-zinc-700 text-white font-medium' 
                    : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'
                }`}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomOwnerSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOwner = options.find(o => o._id === value);
  const displayLabel = selectedOwner ? `${selectedOwner.name} (${selectedOwner.email})` : 'Select a Store Owner';

  return (
    <div className="relative z-50 md:col-span-2" ref={selectRef}>
      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500 z-10" />
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-zinc-900/50 border ${!value ? 'border-red-500/50' : 'border-zinc-700/50'} rounded-xl pl-10 pr-10 py-3 text-sm text-zinc-200 cursor-pointer flex items-center justify-between hover:border-zinc-500 transition-colors`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''} flex-shrink-0`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <div
                key={option._id}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 text-sm cursor-pointer transition-colors border-b last:border-0 border-zinc-700/50 ${
                  value === option._id 
                    ? 'bg-zinc-700 text-white font-medium' 
                    : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'
                }`}
              >
                <div className="font-semibold">{option.name}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{option.email}</div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {!value && <p className="text-[10px] text-red-400 mt-1 ml-1">Store Owner must be selected.</p>}
    </div>
  );
};


const StoreManagement = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ 
    name: '', email: '', address: '', owner: '', phone: '', website: '', description: '', category: 'General'
  });
  const [editId, setEditId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [toast, setToast] = useState(null);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [owners, setOwners] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStores = () => {
    const url = user.role === 'owner' ? '/api/stores?manage=true&limit=100' : '/api/stores?limit=100';
    api.get(url)
      .then(res => {
        if (res.data && res.data.stores) {
          setStores(res.data.stores);
        } else {
          setStores(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch stores:', err);
        setStores([]);
      });
  };

  const fetchOwners = () => {
    if (user.role !== 'admin') return;
    api.get('/api/users?role=owner&limit=100')
      .then(res => {
        setOwners(res.data.users || []);
      })
      .catch(err => {
        console.error('Failed to fetch owners:', err);
      });
  };

  useEffect(() => { 
    fetchStores(); 
    fetchOwners();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handlePhoneChange = e => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm({ ...form, phone: value });
  };

  const handleCategoryChange = (category) => {
    setForm({ ...form, category });
  };

  const handleOwnerChange = (ownerObj) => {
    setForm({ ...form, owner: ownerObj._id, email: ownerObj.email });
  };

  const isFormValid = () => {
    if (!form.name || form.name.length > 50) return false;
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return false;
    if (!form.address || form.address.length > 100) return false;
    if (form.phone && form.phone.length > 0 && form.phone.length !== 10) return false; 
    if (user.role === 'admin' && !form.owner) return false;
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      if (editId) {
        await api.put(`/api/stores/${editId}`, form);
        showToast('Store updated successfully!');
      } else {
        await api.post('/api/stores', form);
        showToast('Store created successfully!');
      }
      resetForm();
      fetchStores();
    } catch (err) {
      console.error('Error submitting form:', err);
      showToast(err.response?.data?.error || 'An error occurred', 'error');
    }
  };

  const resetForm = () => {
    setForm({ 
      name: '', 
      email: user.role === 'owner' ? user.email : '', 
      address: '', 
      owner: '', 
      phone: '', 
      website: '', 
      description: '', 
      category: 'General' 
    });
    setEditId(null);
    setIsFormVisible(false);
  };

  const openForm = () => {
    resetForm();
    setIsFormVisible(true);
  };

  const handleEdit = store => {
    setEditId(store._id);
    setForm({ 
      name: store.name || '', 
      email: store.email || '', 
      address: store.address || '', 
      owner: store.owner || '',
      phone: store.phone || '',
      website: store.website || '',
      description: store.description || '',
      category: store.category || 'General'
    });
    setIsFormVisible(true);
  };

  const confirmDelete = async () => {
    if (!storeToDelete) return;
    try {
      await api.delete(`/api/stores/${storeToDelete._id}`);
      showToast('Store deleted successfully!');
      fetchStores();
    } catch (err) {
      console.error('Error deleting store:', err);
      showToast('Failed to delete store', 'error');
    } finally {
      setStoreToDelete(null);
    }
  };

  const containerFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.1 } }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="pt-16 pb-12 min-h-screen px-6 lg:px-12 text-zinc-100 font-sans"
      initial="hidden"
      animate="show"
      variants={containerFade}
    >
      <div className="max-w-5xl mx-auto">
        {/* TOAST NOTIFICATION */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`fixed top-24 right-6 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 border backdrop-blur-md ${
                toast.type === 'error' 
                  ? 'bg-red-500/20 border-red-500/30 text-red-200' 
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemFade} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-3">
              <Store className="w-8 h-8 text-zinc-400" /> Manage Stores
            </h1>
            <p className="text-zinc-400 text-sm">
              {user.role === 'owner' ? "Add and update your store details here." : "Admin interface to manage all stores."}
            </p>
          </div>
          <button 
            onClick={isFormVisible ? resetForm : openForm}
            className="flex items-center gap-2 bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white transition-colors"
          >
            {isFormVisible ? "Cancel" : <><Plus size={16} /> Add Store</>}
          </button>
        </motion.div>

        {isFormVisible && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            variants={itemFade}
            onSubmit={handleSubmit}
            className="relative z-40 bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 mb-8 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {editId ? 'Update Store Details' : 'Create New Store'}
            </h2>
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              
              {/* STORE NAME */}
              <div className="relative">
                <Store className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input 
                  required 
                  maxLength={50}
                  name="name" 
                  placeholder="Store Name" 
                  value={form.name} 
                  onChange={handleChange} 
                  className={`w-full bg-zinc-900/50 border ${!form.name ? 'border-red-500/50' : 'border-zinc-700/50'} rounded-xl pl-10 pr-12 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-zinc-600 outline-none`} 
                />
                <span className="absolute right-3.5 top-3.5 text-[10px] text-zinc-500">{form.name.length}/50</span>
                {!form.name && <p className="text-[10px] text-red-400 mt-1 ml-1">Store name is required.</p>}
              </div>

              {/* EMAIL */}
              <div className="relative">
                <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input 
                  required 
                  type="email" 
                  name="email" 
                  placeholder="Contact Email" 
                  value={form.email} 
                  onChange={handleChange} 
                  readOnly={user.role === 'owner'}
                  className={`w-full border ${(!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) ? 'border-red-500/50' : 'border-zinc-700/50'} rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none ${user.role === 'owner' ? 'bg-zinc-900/80 text-zinc-500 cursor-not-allowed' : 'bg-zinc-900/50 text-zinc-200 focus:ring-2 focus:ring-zinc-600'}`} 
                />
                {(!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) && <p className="text-[10px] text-red-400 mt-1 ml-1">Valid email is required.</p>}
              </div>

              {/* ADDRESS */}
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input 
                  required 
                  maxLength={100}
                  name="address" 
                  placeholder="Physical Address" 
                  value={form.address} 
                  onChange={handleChange} 
                  className={`w-full bg-zinc-900/50 border ${!form.address ? 'border-red-500/50' : 'border-zinc-700/50'} rounded-xl pl-10 pr-12 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-zinc-600 outline-none`} 
                />
                <span className="absolute right-3.5 top-3.5 text-[10px] text-zinc-500">{form.address.length}/100</span>
                {!form.address && <p className="text-[10px] text-red-400 mt-1 ml-1">Address is required.</p>}
              </div>

              {/* PHONE */}
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input 
                  maxLength={10}
                  name="phone" 
                  placeholder="Mobile Number (10 digits)" 
                  value={form.phone} 
                  onChange={handlePhoneChange} 
                  className={`w-full bg-zinc-900/50 border ${(form.phone && form.phone.length > 0 && form.phone.length !== 10) ? 'border-red-500/50' : 'border-zinc-700/50'} rounded-xl pl-10 pr-12 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-zinc-600 outline-none`} 
                />
                <span className="absolute right-3.5 top-3.5 text-[10px] text-zinc-500">{form.phone.length}/10</span>
                {(form.phone && form.phone.length > 0 && form.phone.length !== 10) && <p className="text-[10px] text-red-400 mt-1 ml-1">Phone number must be exactly 10 digits.</p>}
              </div>

              {/* CUSTOM CATEGORY DROPDOWN */}
              <CustomSelect 
                value={form.category} 
                onChange={handleCategoryChange} 
                options={CATEGORIES} 
              />

              {/* WEBSITE */}
              <div className="relative">
                <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input 
                  name="website" 
                  placeholder="Website URL (Optional)" 
                  value={form.website} 
                  onChange={handleChange} 
                  className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-zinc-600 outline-none" 
                />
              </div>

              {/* OWNER ID (Admin Only) */}
              {user.role === 'admin' && (
                <CustomOwnerSelect 
                  value={form.owner} 
                  onChange={handleOwnerChange} 
                  options={owners} 
                />
              )}
              
              {/* DESCRIPTION */}
              <div className="relative md:col-span-2">
                <AlignLeft className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <textarea 
                  maxLength={250}
                  name="description" 
                  placeholder="Store Description (Optional)" 
                  value={form.description} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl pl-10 pr-12 py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-zinc-600 outline-none resize-none"
                ></textarea>
                <span className="absolute right-3.5 bottom-3.5 text-[10px] text-zinc-500">{form.description.length}/250</span>
              </div>

            </div>
            
            <div className="flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!isFormValid()}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
                  isFormValid() 
                    ? 'bg-zinc-200 text-zinc-900 hover:bg-white' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                }`}
              >
                {editId ? 'Save Changes' : 'Create Store'}
              </button>
            </div>
          </motion.form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.length === 0 ? (
            <motion.div variants={itemFade} className="col-span-full py-12 text-center border border-zinc-700/50 border-dashed rounded-2xl bg-zinc-800/20">
              <Store className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">No stores found. {user.role === 'owner' ? "Add your first store to get started!" : ""}</p>
            </motion.div>
          ) : (
            stores.map((store) => (
              <motion.div
                key={store._id}
                variants={itemFade}
                className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-5 shadow-sm group hover:border-zinc-600 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white tracking-tight">{store.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
                      {store.category || 'General'}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <Globe className="w-3.5 h-3.5" /> {store.email}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <MapPin className="w-3.5 h-3.5" /> {store.address}
                    </div>
                    {store.phone && (
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <Phone className="w-3.5 h-3.5" /> {store.phone}
                      </div>
                    )}
                  </div>
                  
                  {user.role === 'admin' && (
                    <div className="mt-4 mb-2 p-3 bg-zinc-900/50 border border-zinc-700/30 rounded-xl flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-xs text-zinc-500 font-mono">Owner ID: {store.owner}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-5 pt-4 border-t border-zinc-700/50">
                  <button
                    onClick={() => handleEdit(store)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-700/50 hover:bg-zinc-600 text-zinc-200 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setStoreToDelete(store)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {storeToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Delete Store?</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Are you sure you want to delete <span className="text-zinc-200 font-semibold">{storeToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setStoreToDelete(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm"
                >
                  Delete Store
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StoreManagement;
