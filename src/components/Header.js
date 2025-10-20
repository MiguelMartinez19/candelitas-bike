import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import bgImage from './image.png'; 

const Header = () => {
  return (
    <motion.header
      className="relative h-screen bg-black bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: `url(${bgImage})`,

      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/70 via-red-500/50 to-yellow-400/30" />
      <motion.div
        className="text-center z-10 max-w-4xl px-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Candelitas Bike
        </motion.h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Enciende la chispa y únete a la aventura. Rutas iluminadas por la pasión, amigos como familia y el rugido eterno del motor.
        </p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link to="/gallery">
            <motion.button
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-red-500 text-black font-bold px-8 py-4 rounded-full text-lg flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-5 h-5" />
              Galería
            </motion.button>
          </Link>
          <Link to="/members">
            <motion.button
              className="bg-white text-orange-600 font-bold px-8 py-4 rounded-full text-lg flex items-center gap-2 shadow-lg border-2 border-white/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nuestro Crew
              <Bike className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold px-8 py-4 rounded-full text-lg flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Únete al Crew
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Header;