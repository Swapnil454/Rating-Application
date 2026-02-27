import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

const Home = ({ user }) => {
  return (
    <>
      <Helmet>
        <title>Rating App – Rate Stores & Manage Feedback Online</title>

        <meta
          name="description"
          content="Rating App is an online platform to rate stores, manage customer reviews, and explore real user feedback. Perfect for shoppers and store owners."
        />

        <meta
          name="keywords"
          content="rating app, rate stores, store reviews, online ratings, customer feedback platform"
        />

        <meta name="author" content="Rating App" />

        {/* Canonical */}
        <link rel="canonical" href="https://www.ratingapp.online/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Rating App – Rate Stores & Manage Feedback Online" />
        <meta
          property="og:description"
          content="Rate stores, explore feedback, and manage ratings easily with Rating App."
        />
        <meta property="og:url" content="https://www.ratingapp.online/" />
        <meta property="og:image" content="https://www.ratingapp.online/og-image.png" />
        <meta property="og:site_name" content="Rating App" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rating App – Rate Stores & Manage Reviews Online" />
        <meta
          name="twitter:description"
          content="Explore ratings, share reviews, and discover top-rated stores instantly."
        />
        <meta name="twitter:image" content="https://www.ratingapp.online/og-image.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Rating App",
            "url": "https://www.ratingapp.online/",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "description":
              "An online platform to rate stores, manage reviews, and explore real customer feedback."
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-purple-800 via-violet-900 to-black text-white">
        {/* Hero Section */}
        <main>
          <section className="flex flex-col items-center justify-center h-screen text-center px-4">
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Welcome to <span className="text-pink-500">Rating App</span> – Rate Stores & Manage Reviews Online
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Rate your favorite stores, explore user feedback, and manage your ratings with ease. Built for users and store owners.
            </motion.p>

            {!user && (
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
            )}
            
            {user && (
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Link
                  to="/dashboard"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105"
                >
                  Go to Dashboard
                </Link>
                <p className="text-gray-300 mt-4">
                  Welcome back, <span className="font-semibold text-white">{user.name}</span>!
                </p>
              </motion.div>
            )}
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
                { title: "Rate Stores", desc: "Easily submit ratings and feedback for your favorite stores.", link: "/stores" },
                { title: "Manage Ratings", desc: "Track and update your own ratings in a user-friendly dashboard.", link: "/dashboard" },
                { title: "Store Owner View", desc: "Store owners can monitor feedback and identify top customers.",link:"/owner/ratings" },
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
                  {item.link ? (
                    <Link to={item.link} className="block">
                      <h3 className="text-xl font-semibold mb-2 text-pink-600 hover:text-pink-700">{item.title}</h3>
                      <p>{item.desc}</p>
                    </Link>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold mb-2 text-pink-600">{item.title}</h3>
                      <p>{item.desc}</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          <section className="px-6 py-12 bg-gray-50 text-gray-800">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Online Store Rating & Review Platform
              </h2>
              <p className="mb-4">
                Rating App is a modern platform that allows users to rate stores, leave reviews,
                and explore real customer feedback. Whether you are a shopper looking for
                trusted ratings or a store owner monitoring performance, our platform
                makes rating management simple and effective.
              </p>
              <p>
                With a user-friendly dashboard, secure authentication, and real-time
                rating updates, Rating App helps businesses improve customer satisfaction
                while empowering users to make informed decisions.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-400 py-8 text-sm bg-black">
          &copy; {new Date().getFullYear()} Rating App. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Home;
