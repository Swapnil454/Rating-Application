import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-violet-900 to-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-pink-500">Rating App</span>
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Rate your favorite stores, explore user feedback, and manage your ratings with ease. Built for users and store owners.
        </motion.p>

        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link
            to="/signup"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-pink-600 hover:bg-gray-100 px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Log In
          </Link>
        </motion.div>
      </section>

      {/* Scroll down effect */}
      <div className="flex justify-center animate-bounce">
        <svg className="w-6 h-6 text-white mb-4" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Features Section */}
      <section className="px-6 py-12 md:py-24 bg-white text-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Use Rating App?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Rate Stores", desc: "Easily submit ratings and feedback for your favorite stores." },
            { title: "Manage Ratings", desc: "Track and update your own ratings in a user-friendly dashboard." },
            { title: "Store Owner View", desc: "Store owners can monitor feedback and identify top customers." },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="p-6 bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2 text-pink-600">{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-8 text-sm bg-black">
        &copy; {new Date().getFullYear()} Rating App. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
