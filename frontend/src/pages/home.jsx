import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { motion } from 'framer-motion';
import api from '../api/axios';
const CategoryCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 p-6 md:p-8 hover:bg-white/10 hover:border-arcova-gold/50 transition-all duration-300 group">
    <div className="text-arcova-gold mb-6 transition-transform duration-500 group-hover:-translate-y-2">{icon}</div>
    <h3 className="text-xl font-serif mb-3 text-white">{title}</h3>
    <p className="text-white/60 font-sans text-sm leading-relaxed">{desc}</p>
  </div>
);

const ReviewCard = ({ img, date, title }) => (
  <div className="group cursor-pointer">
    <div className="overflow-hidden mb-4 rounded-sm">
      <img src={img} alt="Review" className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-700" />
    </div>
    <div className="text-[10px] text-arcova-gold uppercase tracking-widest font-bold mb-3">{date}</div>
    <h3 className="text-xl md:text-2xl font-serif leading-snug group-hover:text-arcova-gold transition-colors text-white">{title}</h3>
  </div>
);

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ reviewsCount: 0, storesCount: 0, usersCount: 0, awardsCount: 25 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/stats');
        setStats({ ...response.data, awardsCount: 25 });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const heroBg = "/hero_section.png";
  const companyImg1 = "/reliance.png";
  const companyImg2 = "/croma.jpg ";
  const companyImg3 = "/fabindia.jpg";

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <>
      <Helmet>
        <title>RatingApp – Discover India's Best Stores</title>
      </Helmet>

      <div className="min-h-screen bg-arcova-light text-arcova-gray font-sans selection:bg-arcova-gold selection:text-white">

        <section
          className="relative h-[90vh] min-h-[600px] flex items-center pt-20"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-arcova-dark/70 via-arcova-dark/30 to-black/5"></div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full flex flex-col items-start">
            <div className="flex flex-col border-l border-white/20 pl-6 md:pl-10">
              <span className="text-arcova-gold font-sans tracking-[0.2em] uppercase text-xs font-bold mb-6 flex items-center">
                <span className="w-8 h-[1px] bg-arcova-gold mr-3"></span>
                Trust That Inspires
              </span>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-6 drop-shadow-2xl"
                style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.8)' }}
              >
                Discover <br />
                <span className="text-arcova-gold italic">Trusted</span> Stores. <br />
                Share Your Voice.
              </h1>
              <p
                className="text-white/95 font-sans max-w-lg mb-10 text-sm md:text-base font-medium leading-relaxed"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
              >
                From electronics to daily groceries, discover India's best stores through authentic reviews. Rate your experiences and help others make informed shopping decisions.
              </p>
              <Link to={user ? "/stores" : "/signup"} className="inline-flex items-center justify-center bg-arcova-gold hover:bg-arcova-goldHover text-arcova-dark font-sans text-xs uppercase tracking-widest font-bold px-8 py-4 transition-colors w-fit">
                Explore Stores
                <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-20 -mt-5 sm:-mt-6">
          <div className="bg-arcova-dark rounded-full shadow-2xl py-1.5 md:py-2 px-5 md:px-8 flex flex-wrap md:flex-nowrap justify-between items-center border border-white/5">
            {[
              {
                icon: <svg className="w-4 h-4 md:w-5 md:h-5 text-arcova-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>,
                // count: `${stats.reviewsCount}+`, label: 'Reviews' 
                count: "1720+", label: 'Reviews'
              },
              {
                icon: <svg className="w-4 h-4 md:w-5 md:h-5 text-arcova-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>,
                // count: `${stats.storesCount}+`, label: 'Stores' 
                count: "320+", label: 'Stores'
              },
              {
                icon: <svg className="w-4 h-4 md:w-5 md:h-5 text-arcova-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
                // count: `${stats.usersCount}+`, label: 'Users' 
                count: "850+", label: 'Users'
              },
              {
                icon: <svg className="w-4 h-4 md:w-5 md:h-5 text-arcova-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>,
                // count: `${stats.awardsCount}+`, label: 'Partners' 
                count: "110+", label: 'Partners'
              },
            ].map((stat, idx) => (
              <div key={idx} className={`flex items-center gap-2 w-1/2 md:w-auto mb-1.5 md:mb-0 ${idx !== 0 ? 'md:pl-4 md:border-l border-white/10' : ''}`}>
                <div>{stat.icon}</div>
                <div>
                  <div className="text-white font-serif text-sm md:text-base leading-none">{stat.count}</div>
                  <div className="text-white/60 font-sans text-[7px] md:text-[8px] uppercase tracking-widest mt-[2px] leading-none">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="py-12 md:py-16 max-w-7xl mx-auto px-6 lg:px-12 bg-arcova-light">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-1/3 flex flex-col justify-center pr-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-arcova-gold"></span>
                <span className="text-arcova-gold font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs font-bold">Curated Selection</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-arcova-dark leading-[1.1] mb-6">
                Stores <br /> That Define <br /> <span className="text-arcova-gold italic">Excellence.</span>
              </h2>
              <p className="text-arcova-textGray font-sans text-sm md:text-base leading-relaxed mb-10 max-w-sm">
                Discover the most trusted and highly-rated establishments in your city. Verified by thousands of real customer experiences.
              </p>
              <Link to={user ? "/stores" : "/signup"} className="inline-flex items-center justify-center bg-arcova-dark text-white font-sans text-xs uppercase tracking-widest font-bold px-8 py-4 hover:bg-arcova-gold hover:text-arcova-dark shadow-xl transition-all w-fit group">
                View All Stores
                <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="relative group overflow-hidden rounded-2xl cursor-pointer md:col-span-1 md:row-span-2 h-[350px] md:h-[500px] shadow-xl">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
                <img src={companyImg1} alt="Reliance Smart Point" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <span className="inline-block px-3 py-1 bg-arcova-gold text-arcova-dark text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 shadow-lg">Top Rated</span>
                  <h3 className="text-white font-serif text-3xl mb-2 drop-shadow-lg">Reliance Smart Point</h3>
                  <p className="text-white/80 font-sans text-sm font-medium drop-shadow-md">Andheri West, Mumbai</p>
                  <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-arcova-gold group-hover:border-arcova-gold group-hover:text-arcova-dark transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl cursor-pointer h-[200px] md:h-[240px] shadow-xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                <img src={companyImg2} alt="Croma Electronics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-white font-serif text-2xl mb-1 drop-shadow-lg">Croma Electronics</h3>
                  <p className="text-white/80 font-sans text-sm font-medium drop-shadow-md">Koramangala, Bengaluru</p>
                  <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-arcova-gold group-hover:border-arcova-gold group-hover:text-arcova-dark transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl cursor-pointer h-[200px] md:h-[240px] shadow-xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                <img src={companyImg3} alt="FabIndia Flagship" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-white font-serif text-2xl mb-1 drop-shadow-lg">FabIndia Flagship</h3>
                  <p className="text-white/80 font-sans text-sm font-medium drop-shadow-md">Connaught Place, New Delhi</p>
                  <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-arcova-gold group-hover:border-arcova-gold group-hover:text-arcova-dark transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-arcova-dark text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/4">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-arcova-gold"></span>
                <span className="text-arcova-gold font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs font-bold">Our Categories</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-6 text-white">
                End-to-End <br /> <span className="italic text-arcova-gold">Discovery.</span>
              </h2>
              <p className="text-white/60 font-sans text-sm md:text-base leading-relaxed mb-10">
                Explore stores across diverse categories supported by authentic consumer reviews.
              </p>
              <Link to={user ? "/stores" : "/signup"} className="inline-flex items-center justify-center bg-arcova-gold text-arcova-dark font-sans text-xs uppercase tracking-widest font-bold px-8 py-4 hover:bg-white shadow-xl transition-all group w-fit">
                Explore Categories
                <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
            <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <CategoryCard
                icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
                title="Electronics & Tech"
                desc="Find trusted local dealers and reliable tech service centers."
              />
              <CategoryCard
                icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                title="Groceries & Marts"
                desc="Discover fresh produce and well-stocked daily supermarkets."
              />
              <CategoryCard
                icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>}
                title="Fashion & Apparel"
                desc="Explore trendy boutiques, ethnic wear, and brand outlets."
              />
              <CategoryCard
                icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>}
                title="Home & Decor"
                desc="Find quality furniture and trusted home improvement stores."
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-8">
              <div className="lg:w-1/2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[1px] bg-arcova-gold"></span>
                  <span className="text-arcova-gold font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs font-bold">Our Process</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-arcova-dark leading-[1.1]">
                  A Seamless <br /> Journey To <br /> <span className="italic text-arcova-gold">Better Shopping.</span>
                </h2>
              </div>
              <div className="lg:w-1/3">
                <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed mb-6">
                  We've streamlined the way you discover, visit, and review the best businesses in your local area. Follow these simple steps to join our trusted community.
                </p>
                <button className="inline-flex items-center justify-center bg-arcova-dark text-white font-sans text-xs uppercase tracking-widest font-bold px-8 py-4 hover:bg-arcova-gold hover:text-arcova-dark shadow-xl transition-all w-fit">
                  How We Work
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 border-t border-arcova-border/10 pt-10">
              {[
                { step: '01', title: 'Search', desc: 'Find local businesses and stores across India.' },
                { step: '02', title: 'Visit', desc: 'Visit the store and experience their customer service.' },
                { step: '03', title: 'Rate', desc: 'Write a detailed, honest review of your experience.' },
                { step: '04', title: 'Help', desc: 'Help others make better, informed choices.' },
                { step: '05', title: 'Trust', desc: 'Support a growing community of trusted buyers.' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col relative group">
                  <div className="text-5xl md:text-6xl font-serif text-arcova-gold mb-4 transition-transform duration-500 group-hover:-translate-y-1">
                    {item.step}
                  </div>
                  <h4 className="font-serif text-xl text-arcova-dark mb-2">{item.title}</h4>
                  <p className="font-sans text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 md:py-10 bg-arcova-dark text-white border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-6">
              <div>
                <span className="text-arcova-gold font-sans tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Insights</span>
                <h2 className="text-4xl md:text-5xl font-serif leading-[1.2]">
                  Real Voices. <br /> Real Experiences.
                </h2>
              </div>
              <Link to={user ? "/stores" : "/signup"} className="inline-flex items-center bg-white text-[#0A0A0A] font-sans text-xs uppercase tracking-widest font-bold px-8 py-4 hover:bg-arcova-gold hover:text-[#0A0A0A] transition-all group mt-8 md:mt-0 rounded-sm">
                View All Reviews
                <svg className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <ReviewCard
                img="/artisanal_coffe.avif"
                date="22 MAY, 2024"
                title="Incredible artisanal coffee and ambiance at Blue Tokai"
              />
              <ReviewCard
                img="/bookstore.avif"
                date="18 MAY, 2024"
                title="A true book lover's paradise at Crossword Bookstore"
              />
              <ReviewCard
                 img="/dining_ex.avif"
                date="05 MAY, 2024"
                title="Exquisite fine dining experience at The Bombay Canteen"
              />
            </div>
          </div>
        </section>

        <footer className="bg-[#0A0A0A] border-t border-white/5 pt-16 pb-10 text-white relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between pb-16 border-b border-white/5 mb-10 gap-12">
              <div className="md:w-1/2 md:border-l border-white/10 md:pl-8">
                <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-[1.1] text-white">
                  Let's Build <br /> <span className="italic text-arcova-gold">Trust</span> <br /> Together.
                </h2>
                <Link to={user ? "/stores" : "/signup"} className="inline-flex bg-white hover:bg-arcova-gold text-[#0A0A0A] font-sans text-xs uppercase tracking-widest font-bold px-8 py-4 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] group items-center w-fit rounded-sm">
                  Rate a Store
                  <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
              <div className="md:w-1/4 flex flex-col space-y-6 text-sm font-sans text-white/60">
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-arcova-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span className="hover:text-white transition-colors cursor-pointer">info@ratingapp.in</span>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-arcova-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span className="hover:text-white transition-colors cursor-pointer">+91 98765 43210</span>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-arcova-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>107, Front of Amanora Mall, MG Road,<br />Pune, MH 411001</span>
                </div>
                <div className="pt-6">
                  <span className="text-xs uppercase tracking-widest font-bold text-white mb-4 block">Follow Us</span>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-arcova-gold hover:text-[#0A0A0A] hover:bg-arcova-gold transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-arcova-gold hover:text-[#0A0A0A] hover:bg-arcova-gold transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-arcova-gold hover:text-[#0A0A0A] hover:bg-arcova-gold transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="md:w-1/4">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-serif font-bold text-arcova-gold">R</span>
                  <span className="text-xl font-sans tracking-widest uppercase text-white font-bold">RatingApp</span>
                </div>
                <p className="text-white/50 font-sans text-sm leading-relaxed">
                  We connect Indian consumers with trusted local stores through authentic, community-driven reviews.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-sans tracking-widest uppercase text-white font-bold">
              <div>© {new Date().getFullYear()} RATINGAPP. ALL RIGHTS RESERVED.</div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-arcova-gold transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-arcova-gold transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Home;
