import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[460px] relative z-10"
      >
        
        <div className="text-center mb-6">
           <Link to="/" className="inline-block">
             <span className="text-4xl text-white tracking-wide hover:text-arcova-gold transition-colors" style={{ fontFamily: "'Pacifico', cursive" }}>
               Rating App
             </span>
           </Link>
        </div>

        <div className="w-full">
          {children}
        </div>
      </motion.div>

    </div>
  );
};

export default AuthLayout;
