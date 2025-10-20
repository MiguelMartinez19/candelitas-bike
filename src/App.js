import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import About from './components/About';
import Gallery from './components/Gallery';
// import Events from './components/Events';
import RegisterForm from './components/RegisterForm';
import MembersList from './components/MembersList';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Routes>
            <Route path="/" element={
              <>
                <About />
                <Gallery />
                {/* <Events /> */}
              </>
            } />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </motion.main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;